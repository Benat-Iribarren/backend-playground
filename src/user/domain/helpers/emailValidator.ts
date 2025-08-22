const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(email: string): boolean {
  return EMAIL_FORMAT.test(email);
}
