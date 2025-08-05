import { UserLoginErrors } from './userLoginErrors';

export const missingNinOrPhoneMsg = 'MISSING_NIN_OR_PHONE' as const;
export const invalidNinOrPhoneMsg = 'INVALID_NIN_OR_PHONE' as const;

export type MissingNinOrPhoneError = typeof missingNinOrPhoneMsg;
export type InvalidNinOrPhoneError = typeof invalidNinOrPhoneMsg;

export type RequestOtpErrors = MissingNinOrPhoneError | InvalidNinOrPhoneError | UserLoginErrors;
