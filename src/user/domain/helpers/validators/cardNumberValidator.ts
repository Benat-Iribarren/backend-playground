const CARD_FORMAT = /^\d{13,19}$/;

function normalizeCardNumber(input: string): string {
  return String(input).replace(/[\s-]/g, '');
}

export function isValidCardNumber(cardNumber: string): boolean {
  return CARD_FORMAT.test(normalizeCardNumber(cardNumber));
}
