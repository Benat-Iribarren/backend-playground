const CARD_FORMAT = /^\d{13,19}$/;
export function isValidCardNumber(cardNumber: string): boolean {
  return CARD_FORMAT.test(cardNumber);
}
