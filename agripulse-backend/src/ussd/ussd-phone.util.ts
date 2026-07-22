import { createHash } from 'crypto';

/** NF-SEC-03 — hash MSISDN with pepper; never persist or log the raw number. */
export function hashPhoneNumber(phoneNumber: string, pepper: string): string {
  return createHash('sha256')
    .update(`${pepper}:${phoneNumber.trim()}`)
    .digest('hex');
}
