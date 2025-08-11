import { OtpLoginErrors } from '../../../../domain/errors/otpLoginError';

export const missingHashOrCodeErrorStatusMsg = 'MISSING_HASH_OR_CODE' as const;
export const invalidHashOrCodeErrorStatusMsg = 'INVALID_HASH_OR_CODE' as const;

export type MissingHashOrCodeError = typeof missingHashOrCodeErrorStatusMsg;
export type InvalidHashOrCodeError = typeof invalidHashOrCodeErrorStatusMsg;

export type VerifyOtpErrors = MissingHashOrCodeError | InvalidHashOrCodeError | OtpLoginErrors;
