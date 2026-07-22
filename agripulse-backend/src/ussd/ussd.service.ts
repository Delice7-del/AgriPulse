import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UssdSession } from '@prisma/client';
import { PredictionsService } from '../predictions/predictions.service';
import { PrismaService } from '../prisma/prisma.service';
import { UssdRequestDto } from './dto/ussd-request.dto';
import {
  USSD_SCREEN_LIMIT,
  UssdLanguage,
  formatAiAdviceUssd,
  t,
  ussdCopy,
} from './ussd.messages';
import { hashPhoneNumber } from './ussd-phone.util';

type Menu = 'root' | 'crops' | 'ai_crops';

@Injectable()
export class UssdService {
  private readonly logger = new Logger(UssdService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly predictionsService: PredictionsService,
  ) {}

  async handle(dto: UssdRequestDto): Promise<string> {
    try {
      const pepper = this.config.getOrThrow<string>('USSD_PHONE_PEPPER');
      // Hash immediately — raw phoneNumber must not be stored or logged (NF-SEC-03)
      const phoneHash = hashPhoneNumber(dto.phoneNumber, pepper);

      const segments = this.parseText(dto.text);
      const session = await this.getOrCreateSession(dto.sessionId, phoneHash);
      const lang = this.resolveLanguage(session.language);

      const response = await this.route(session, segments, lang);
      return this.fitScreen(response);
    } catch (error) {
      this.logger.error(
        'USSD handler failed',
        error instanceof Error ? error.stack : String(error),
      );
      return `END ${ussdCopy.error}`;
    }
  }

  private parseText(text?: string): string[] {
    if (!text || text.trim() === '') {
      return [];
    }
    return text
      .split('*')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  private resolveLanguage(value: string): UssdLanguage {
    return value === 'en' ? 'en' : 'rw';
  }

  private async getOrCreateSession(
    sessionId: string,
    phoneHash: string,
  ): Promise<UssdSession> {
    const existing = await this.prisma.ussdSession.findUnique({
      where: { sessionId },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.ussdSession.create({
      data: {
        sessionId,
        phoneHash,
        language: 'rw',
        currentMenu: 'root',
        status: 'active',
      },
    });
  }

  /**
   * Navigate from session.currentMenu using the *last* text segment.
   * Full path still arrives as "3*1" after a language toggle; last-segment
   * routing avoids treating the leading "3" as the next choice.
   */
  private async route(
    session: UssdSession,
    segments: string[],
    lang: UssdLanguage,
  ): Promise<string> {
    const menu = (session.currentMenu as Menu | null) ?? 'root';

    if (segments.length === 0) {
      await this.setMenu(session.id, 'root');
      return this.con(t('root', lang));
    }

    const choice = segments[segments.length - 1];

    if (menu === 'crops') {
      return this.handleCropSelection(session, choice, lang);
    }

    if (menu === 'ai_crops') {
      return this.handleAiCropSelection(session, choice, lang);
    }

    // menu === 'root'
    if (choice === '1') {
      return this.showCropMenu(session, lang, 'crops');
    }

    if (choice === '2') {
      return this.showCropMenu(session, lang, 'ai_crops');
    }

    if (choice === '3') {
      return this.handleLanguage(session, lang);
    }

    await this.setMenu(session.id, 'root');
    return this.con(`${t('invalidOption', lang)}\n${t('root', lang)}`);
  }

  private async showCropMenu(
    session: UssdSession,
    lang: UssdLanguage,
    nextMenu: 'crops' | 'ai_crops',
  ): Promise<string> {
    const crops = await this.prisma.crop.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    if (crops.length === 0) {
      await this.endSession(session.id, 'completed');
      return this.end(t('noCrops', lang));
    }

    await this.setMenu(session.id, nextMenu);
    const headerKey = nextMenu === 'ai_crops' ? 'pickCropAi' : 'pickCrop';
    return this.con(this.formatCropMenu(crops, lang, headerKey));
  }

  private async handleCropSelection(
    session: UssdSession,
    choice: string,
    lang: UssdLanguage,
  ): Promise<string> {
    const crops = await this.prisma.crop.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    if (crops.length === 0) {
      await this.endSession(session.id, 'completed');
      return this.end(t('noCrops', lang));
    }

    const index = Number.parseInt(choice, 10);
    if (!Number.isInteger(index) || index < 1 || index > crops.length) {
      await this.setMenu(session.id, 'crops');
      return this.con(
        `${t('invalidOption', lang)}\n${this.formatCropMenu(crops, lang, 'pickCrop')}`,
      );
    }

    const crop = crops[index - 1];
    await this.logCropQuery(crop.id, 'ussd_prices', session.sessionId);

    const priceLines = await this.buildPriceLines(crop.id, crop.unit);

    if (priceLines.length === 0) {
      // F-USS-05
      await this.endSession(session.id, 'completed');
      return this.end(t('noPriceData', lang));
    }

    const cropLabel =
      lang === 'rw' && crop.nameRw ? crop.nameRw : crop.name;
    // F-USS-03 — prices for all active markets where the crop is available
    const body = [`${cropLabel}:`, ...priceLines].join('\n');

    await this.endSession(session.id, 'completed');
    return this.end(body);
  }

  private async handleAiCropSelection(
    session: UssdSession,
    choice: string,
    lang: UssdLanguage,
  ): Promise<string> {
    const crops = await this.prisma.crop.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    if (crops.length === 0) {
      await this.endSession(session.id, 'completed');
      return this.end(t('noCrops', lang));
    }

    const index = Number.parseInt(choice, 10);
    if (!Number.isInteger(index) || index < 1 || index > crops.length) {
      await this.setMenu(session.id, 'ai_crops');
      return this.con(
        `${t('invalidOption', lang)}\n${this.formatCropMenu(crops, lang, 'pickCropAi')}`,
      );
    }

    const crop = crops[index - 1];
    await this.logCropQuery(crop.id, 'ussd_ai', session.sessionId);

    // F-AI-01 — market optional; USSD asks crop only in Step A
    const result = await this.predictionsService.predict({
      cropId: crop.id,
    });

    await this.endSession(session.id, 'completed');

    if (result.status === 'insufficient_data') {
      return this.end(t('aiInsufficientData', lang));
    }

    if (result.status === 'unavailable') {
      return this.end(t('aiUnavailable', lang));
    }

    // F-AI-03 string template
    return this.end(
      formatAiAdviceUssd(
        lang,
        result.recommendation as 'sell_now' | 'wait',
        result.predictedDirection as 'rise' | 'fall',
        result.confidence ?? 0,
        result.currentPrice ?? 0,
      ),
    );
  }

  private async logCropQuery(
    cropId: string,
    source: 'ussd_prices' | 'ussd_ai',
    ussdSessionId: string,
  ): Promise<void> {
    // F-ADM-06 — feed top-crops analytics (no PII)
    await this.prisma.cropQueryLog.create({
      data: { cropId, source, ussdSessionId },
    });
  }

  private async buildPriceLines(
    cropId: string,
    unit: string,
  ): Promise<string[]> {
    // Latest price per active crop-market (F-USS-03 / F-USS-04)
    const rows = await this.prisma.$queryRaw<
      Array<{ marketName: string; price: string | number }>
    >`
      SELECT DISTINCT ON (dp.market_id)
        m.name AS "marketName",
        dp.price
      FROM daily_prices dp
      INNER JOIN crop_markets cm
        ON cm.crop_id = dp.crop_id
       AND cm.market_id = dp.market_id
       AND cm.is_active = true
      INNER JOIN markets m
        ON m.id = dp.market_id
       AND m.is_active = true
      WHERE dp.crop_id = ${cropId}::uuid
      ORDER BY dp.market_id, dp.recorded_at DESC
    `;

    return rows.map((row) => {
      const price = Number(row.price).toFixed(0);
      // F-USS-03 style line: "Market: 520 RWF/kg"
      return `${row.marketName}: ${price} RWF/${unit}`;
    });
  }

  private formatCropMenu(
    crops: Array<{ name: string; nameRw: string | null }>,
    lang: UssdLanguage,
    headerKey: 'pickCrop' | 'pickCropAi',
  ): string {
    const header = t(headerKey, lang);
    const lines = crops.map((crop, i) => {
      const label =
        lang === 'rw' && crop.nameRw ? crop.nameRw : crop.name;
      return `${i + 1}. ${label}`;
    });
    return [header, ...lines].join('\n');
  }

  private async handleLanguage(
    session: UssdSession,
    lang: UssdLanguage,
  ): Promise<string> {
    const next: UssdLanguage = lang === 'rw' ? 'en' : 'rw';
    await this.prisma.ussdSession.update({
      where: { id: session.id },
      data: { language: next, currentMenu: 'root' },
    });
    // CON back to root after toggle — not END
    return this.con(`${t('languageChanged', next)}\n${t('root', next)}`);
  }

  private async setMenu(sessionPk: string, menu: Menu): Promise<void> {
    await this.prisma.ussdSession.update({
      where: { id: sessionPk },
      data: { currentMenu: menu },
    });
  }

  private async endSession(
    sessionPk: string,
    status: 'completed' | 'error',
  ): Promise<void> {
    // TODO(F-USS / NF): add a cron/scheduler to mark stale active sessions as
    // status "timeout" after the gateway idle window — not built in this phase.
    await this.prisma.ussdSession.update({
      where: { id: sessionPk },
      data: { status, endedAt: new Date(), currentMenu: null },
    });
  }

  private con(text: string): string {
    return `CON ${text}`;
  }

  private end(text: string): string {
    return `END ${text}`;
  }

  /**
   * §4.1 — 182-character USSD screen limit.
   * TODO(F-USS-06): stub pagination — if content exceeds the limit, truncate for
   * now; later split into pages (e.g. "98. More") instead of hard truncation.
   */
  private fitScreen(response: string): string {
    if (response.length <= USSD_SCREEN_LIMIT) {
      return response;
    }

    const prefix = response.startsWith('END ')
      ? 'END '
      : response.startsWith('CON ')
        ? 'CON '
        : '';
    const body = response.slice(prefix.length);
    const budget = USSD_SCREEN_LIMIT - prefix.length - 3; // "..."
    const truncated = body.slice(0, Math.max(0, budget)).trimEnd();
    return `${prefix}${truncated}...`;
  }
}
