export const incorrectHashOrCodeErrorStatusMsg = 'INCORRECT_HASH_OR_CODE' as const;
export const expiredVerificationCodeErrorStatusMsg = 'EXPIRED_VERIFICATION_CODE' as const;

export type IncorrectHashOrCodeError = typeof incorrectHashOrCodeErrorStatusMsg;
export type ExpiredVerificationCodeError = typeof expiredVerificationCodeErrorStatusMsg;

export type OtpLoginErrors = IncorrectHashOrCodeError | ExpiredVerificationCodeError;
