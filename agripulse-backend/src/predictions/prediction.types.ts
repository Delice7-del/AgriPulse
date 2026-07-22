export type Recommendation = 'sell_now' | 'wait';
export type PredictedDirection = 'rise' | 'fall';

export type PredictionStatus = 'ok' | 'insufficient_data' | 'unavailable';

export interface PredictionResult {
  status: PredictionStatus;
  cropId: string;
  marketId: string | null;
  recommendation: Recommendation | 'insufficient_data' | 'unavailable';
  predictedDirection: PredictedDirection | 'none';
  confidence: number | null;
  currentPrice: number | null;
  horizonDays: number;
  dataPoints: number;
  message: string;
}
