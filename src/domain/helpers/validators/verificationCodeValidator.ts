const VERIFICATION_CODE_FORMAT = new RegExp(/^[0-9]{6}$/);
export function invalidVerificationCode(verificationCode: string): boolean {
  return !VERIFICATION_CODE_FORMAT.test(verificationCode);
}
