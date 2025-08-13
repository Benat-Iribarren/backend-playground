import {
  ExpiredVerificationCodeError,
  OtpNotFoundError,
} from '../../../domain/errors/otpLoginError';

export const missingHashOrCodeErrorStatusMsg = 'MISSING_HASH_OR_CODE' as const;
export const invalidHashOrCodeErrorStatusMsg = 'INVALID_HASH_OR_CODE' as const;

export type MissingHashOrCodeError = typeof missingHashOrCodeErrorStatusMsg;
export type InvalidHashOrCodeError = typeof invalidHashOrCodeErrorStatusMsg;

export type VerifyOtpParameterErrors = MissingHashOrCodeError | InvalidHashOrCodeError;

export type VerifyOtpErrors =
  | VerifyOtpParameterErrors
  | OtpNotFoundError
  | ExpiredVerificationCodeError;
