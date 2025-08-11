export const otpNotFoundErrorStatusMsg = 'OTP_NOT_FOUND' as const;
export const expiredVerificationCodeErrorStatusMsg = 'EXPIRED_VERIFICATION_CODE' as const;

export type OtpNotFoundError = typeof otpNotFoundErrorStatusMsg;
export type ExpiredVerificationCodeError = typeof expiredVerificationCodeErrorStatusMsg;

export type OtpLoginErrors = OtpNotFoundError | ExpiredVerificationCodeError;
