export const missingHashOrCodeErrorStatusMsg = 'MISSING_HASH_OR_CODE' as const;
export const invalidHashOrCodeErrorStatusMsg = 'INVALID_HASH_OR_CODE' as const;
export const incorrectHashOrCodeErrorStatusMsg = 'INCORRECT_HASH_OR_CODE' as const;

export type MissingHashOrCodeError = typeof missingHashOrCodeErrorStatusMsg;
export type InvalidHashOrCodeError = typeof invalidHashOrCodeErrorStatusMsg;
export type IncorrectHashOrCodeError = typeof incorrectHashOrCodeErrorStatusMsg;

export type VerifyOtpErrors =
  | MissingHashOrCodeError
  | InvalidHashOrCodeError
  | IncorrectHashOrCodeError;
