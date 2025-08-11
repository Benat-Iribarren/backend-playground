const PHONE_FORMAT = new RegExp(/^\+?\d{9,11}$/);
export function isValidPhone(phone: string): boolean {
  return PHONE_FORMAT.test(phone);
}
