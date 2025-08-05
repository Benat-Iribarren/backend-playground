export const missingHashOrCodeErrorMsg = 'MISSING_HASH_OR_CODE' as const;
export const invalidHashOrCodeErrorMsg = 'INVALID_HASH_OR_CODE' as const;
export const incorrectHashOrCodeErrorMsg = 'INCORRECT_HASH_OR_CODE' as const;

export type MissingHashOrCodeError = typeof missingHashOrCodeErrorMsg;
export type InvalidHashOrCodeError = typeof invalidHashOrCodeErrorMsg;
export type IncorrectHashOrCodeError = typeof incorrectHashOrCodeErrorMsg;

export type VerifyOtpErrors =
  | MissingHashOrCodeError
  | InvalidHashOrCodeError
  | IncorrectHashOrCodeError;
