import { Brand, CardNumber } from '@user/domain/model/Card';

export function detectCardBrand(cardNumber: CardNumber): Brand {
  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNumber)) {
    return 'VISA';
  }
  if (
    /^5[1-5][0-9]{14}$/.test(cardNumber) ||
    /^2(2[2-9][0-9]|[3-6][0-9]{2}|7[01][0-9]|720)[0-9]{12}$/.test(cardNumber)
  ) {
    return 'MASTERCARD';
  }
  if (/^3[47][0-9]{13}$/.test(cardNumber)) {
    return 'AMEX';
  }
  if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cardNumber)) {
    return 'DISCOVER';
  }
  return 'UNKNOWN';
}
