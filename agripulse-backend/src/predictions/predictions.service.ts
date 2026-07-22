import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PricesService } from '../prices/prices.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import {
  PredictedDirection,
  PredictionResult,
  Recommendation,
} from './prediction.types';

/** Minimum history points required before advising (F-AI-06). */
export const MIN_HISTORY_POINTS = 7;

/** F-BAC-03 — prediction must respond within this budget. */
export const PREDICTION_TIMEOUT_MS = 3000;

const DEFAULT_WINDOW = 14;
const HORIZON_DAYS = 5;
/** Relative gap vs window average to call a clear rise/fall. */
const AVG_THRESHOLD = 0.03;

@Injectable()
export class PredictionsService {
  private readonly logger = new Logger(PredictionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pricesService: PricesService,
  ) {}

  async predict(dto: CreatePredictionDto): Promise<PredictionResult> {
    const crop = await this.prisma.crop.findUnique({
      where: { id: dto.cropId },
    });
    if (!crop || !crop.isActive) {
      throw new NotFoundException(`Crop with id "${dto.cropId}" not found`);
    }

    if (dto.marketId) {
      const market = await this.prisma.market.findUnique({
        where: { id: dto.marketId },
      });
      if (!market || !market.isActive) {
        throw new NotFoundException(
          `Market with id "${dto.marketId}" not found`,
        );
      }
    }

    try {
      return await this.withTimeout(
        this.runPrediction(dto),
        PREDICTION_TIMEOUT_MS,
      );
    } catch (error) {
      if (error instanceof PredictionTimeoutError) {
        this.logger.warn(
          `Prediction timed out after ${PREDICTION_TIMEOUT_MS}ms for crop=${dto.cropId}`,
        );
        const unavailable = this.unavailableResult(dto);
        await this.logPrediction(unavailable);
        return unavailable;
      }
      throw error;
    }
  }

  private async runPrediction(
    dto: CreatePredictionDto,
  ): Promise<PredictionResult> {
    const window = dto.historicalDataWindow ?? DEFAULT_WINDOW;
    const history = await this.pricesService.findRecentPricePoints(
      dto.cropId,
      dto.marketId,
      window,
    );

    const currentPrice =
      history.length > 0 ? Number(history[history.length - 1].price) : 0;

    if (history.length < MIN_HISTORY_POINTS) {
      // F-AI-06 — not enough data for a defensible recommendation
      const result: PredictionResult = {
        status: 'insufficient_data',
        cropId: dto.cropId,
        marketId: dto.marketId ?? null,
        recommendation: 'insufficient_data',
        predictedDirection: 'none',
        confidence: null,
        currentPrice: history.length > 0 ? currentPrice : null,
        horizonDays: HORIZON_DAYS,
        dataPoints: history.length,
        message:
          'Not enough price history to give advice. Please try again later.',
      };
      await this.logPrediction(result);
      return result;
    }

    const baseline = this.baselinePredict(history.map((h) => Number(h.price)));
    const result: PredictionResult = {
      status: 'ok',
      cropId: dto.cropId,
      marketId: dto.marketId ?? null,
      recommendation: baseline.recommendation,
      predictedDirection: baseline.predictedDirection,
      confidence: baseline.confidence,
      currentPrice,
      horizonDays: HORIZON_DAYS,
      dataPoints: history.length,
      message: this.formatApiMessage(
        baseline.recommendation,
        baseline.predictedDirection,
        baseline.confidence,
        currentPrice,
      ),
    };

    await this.logPrediction(result);
    return result;
  }

  /**
   * PLACEHOLDER baseline — NOT the production LSTM/ML model (see glossary).
   * Compares the latest price to the mean of the last N points, with a short
   * slope fallback when the gap is within the threshold. Replace in Step B.
   */
  private baselinePredict(prices: number[]): {
    recommendation: Recommendation;
    predictedDirection: PredictedDirection;
    confidence: number;
  } {
    const window = prices.slice(-MIN_HISTORY_POINTS);
    const current = window[window.length - 1];
    const average = window.reduce((sum, p) => sum + p, 0) / window.length;
    const gap = (current - average) / average;

    if (gap > AVG_THRESHOLD) {
      // Price above recent average → expect further rise → wait to sell
      return {
        recommendation: 'wait',
        predictedDirection: 'rise',
        confidence: this.clampConfidence(0.55 + Math.abs(gap)),
      };
    }

    if (gap < -AVG_THRESHOLD) {
      // Price below recent average → expect further fall → sell now
      return {
        recommendation: 'sell_now',
        predictedDirection: 'fall',
        confidence: this.clampConfidence(0.55 + Math.abs(gap)),
      };
    }

    // Near average — use short-term slope (last half vs first half of window)
    const mid = Math.floor(window.length / 2);
    const firstAvg =
      window.slice(0, mid).reduce((s, p) => s + p, 0) / mid;
    const secondAvg =
      window.slice(mid).reduce((s, p) => s + p, 0) / (window.length - mid);
    const rising = secondAvg >= firstAvg;

    return {
      recommendation: rising ? 'wait' : 'sell_now',
      predictedDirection: rising ? 'rise' : 'fall',
      confidence: this.clampConfidence(0.5 + Math.abs(gap)),
    };
  }

  private clampConfidence(value: number): number {
    return Math.round(Math.min(0.95, Math.max(0.5, value)) * 100) / 100;
  }

  private formatApiMessage(
    recommendation: Recommendation,
    direction: PredictedDirection,
    confidence: number,
    currentPrice: number,
  ): string {
    const action = recommendation === 'sell_now' ? 'SELL NOW' : 'WAIT';
    const dir = direction.toUpperCase();
    const conf = Math.round(confidence * 100);
    return `Advice: ${action}. Expect ${dir}. Conf: ${conf}%. Now: ${currentPrice.toFixed(0)} RWF/kg`;
  }

  private unavailableResult(dto: CreatePredictionDto): PredictionResult {
    return {
      status: 'unavailable',
      cropId: dto.cropId,
      marketId: dto.marketId ?? null,
      recommendation: 'unavailable',
      predictedDirection: 'none',
      confidence: null,
      currentPrice: null,
      horizonDays: HORIZON_DAYS,
      dataPoints: 0,
      message: 'AI advice is temporarily unavailable. Please try again later.',
    };
  }

  /** F-AI-05 — persist every outcome, including insufficient / timeout. */
  private async logPrediction(result: PredictionResult): Promise<void> {
    const priceForLog = result.currentPrice ?? 0;

    await this.prisma.predictionLog.create({
      data: {
        cropId: result.cropId,
        marketId: result.marketId,
        currentPrice: new Prisma.Decimal(priceForLog),
        recommendation: result.recommendation,
        predictedDirection: result.predictedDirection,
        confidence: result.confidence,
        horizonDays: result.horizonDays,
      },
    });
  }

  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        setTimeout(() => reject(new PredictionTimeoutError()), ms);
      }),
    ]);
  }
}

class PredictionTimeoutError extends Error {
  constructor() {
    super('Prediction timed out');
    this.name = 'PredictionTimeoutError';
  }
}
