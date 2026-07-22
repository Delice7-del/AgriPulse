export type UssdLanguage = 'rw' | 'en';

export const USSD_SCREEN_LIMIT = 182;

export const ussdCopy = {
  root: {
    en: 'AgriPulse\n1. Check Prices\n2. AI Advice\n3. Language',
    rw: 'AgriPulse\n1. Reba Ibiciro\n2. Inama ya AI\n3. Ururimi',
  },
  pickCrop: {
    en: 'Select crop:',
    rw: 'Hitamo igihingwa:',
  },
  pickCropAi: {
    en: 'AI Advice — select crop:',
    rw: 'Inama ya AI — hitamo igihingwa:',
  },
  noCrops: {
    en: 'No crops available. Please try again later.',
    rw: 'Nta bihingwa biboneka. Ongera ugerageze.',
  },
  // F-USS-05
  noPriceData: {
    en: 'No price data available for this crop today. Please try again later.',
    rw: 'Nta giciro kiboneka kuri iki gihingwa uyu munsi. Ongera ugerageze.',
  },
  // F-AI-06
  aiInsufficientData: {
    en: 'Not enough price history to give advice. Try again later.',
    rw: 'Amakuru aranoye. Nta nama ishobora gutangwa. Ongera ugerageze.',
  },
  aiUnavailable: {
    en: 'AI advice is temporarily unavailable. Try again later.',
    rw: 'Inama ya AI ntiboneka ubu. Ongera ugerageze.',
  },
  invalidOption: {
    en: 'Invalid option. Try again.',
    rw: 'Wahisemo nabi. Ongera ugerageze.',
  },
  languageChanged: {
    en: 'Language set to English.',
    rw: 'Ururimi rwahinduwe mu Kinyarwanda.',
  },
  error: 'Something went wrong. Please try again later.',
} as const;

export function t(
  key: Exclude<keyof typeof ussdCopy, 'error'>,
  lang: UssdLanguage,
): string {
  return ussdCopy[key][lang];
}

/** F-AI-03 — USSD advice string template (keep under §4.1 182 chars). */
export function formatAiAdviceUssd(
  lang: UssdLanguage,
  recommendation: 'sell_now' | 'wait',
  direction: 'rise' | 'fall',
  confidence: number,
  currentPrice: number,
): string {
  const conf = Math.round(confidence * 100);
  const price = currentPrice.toFixed(0);

  if (lang === 'rw') {
    const action = recommendation === 'sell_now' ? 'GURISHA NONE' : 'TEGEREZA';
    const dir = direction === 'rise' ? 'KUZAMUKA' : 'GUSUBIRA';
    return `Inama: ${action}. Igiciro: ${dir}. Kwizeye: ${conf}%. Ubu: ${price} RWF/kg`;
  }

  const action = recommendation === 'sell_now' ? 'SELL NOW' : 'WAIT';
  const dir = direction.toUpperCase();
  return `Advice: ${action}. Expect ${dir}. Conf: ${conf}%. Now: ${price} RWF/kg`;
}
