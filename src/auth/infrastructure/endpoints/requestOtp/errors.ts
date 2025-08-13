import {
  UserBlockedError,
  UserNotFoundError,
  UserPhoneUnavailableError,
} from '../../../domain/errors/userLoginErrors';

export const missingNinOrPhoneErrorStatusMsg = 'MISSING_NIN_OR_PHONE' as const;
export const invalidNinOrPhoneErrorStatusMsg = 'INVALID_NIN_OR_PHONE' as const;

export type MissingNinOrPhoneError = typeof missingNinOrPhoneErrorStatusMsg;
export type InvalidNinOrPhoneError = typeof invalidNinOrPhoneErrorStatusMsg;

export type RequestOtpParameterErrors = MissingNinOrPhoneError | InvalidNinOrPhoneError;

export type RequestOtpErrors =
  | RequestOtpParameterErrors
  | UserPhoneUnavailableError
  | UserBlockedError
  | UserNotFoundError;
