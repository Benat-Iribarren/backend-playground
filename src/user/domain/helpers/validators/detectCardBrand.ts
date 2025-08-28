import { Brand, CardNumber } from '@user/domain/model/Card';

export function detectCardBrand(cardNumber: CardNumber): Brand {
  const digits = String(cardNumber).replace(/\D+/g, '');

  if (/^4\d{12}(\d{3})?$/.test(digits)) {
    return 'VISA';
  }
  if (/^(?:5[1-5]\d{14}|2(?:2[2-9]\d|[3-6]\d{2}|7[01]\d|720)\d{12})$/.test(digits)) {
    return 'MASTERCARD';
  }
  if (/^3[47]\d{13}$/.test(digits)) {
    return 'AMEX';
  }
  if (/^6(?:011|5\d{2})\d{12}$/.test(digits)) {
    return 'DISCOVER';
  }
  return 'UNKNOWN';
}
