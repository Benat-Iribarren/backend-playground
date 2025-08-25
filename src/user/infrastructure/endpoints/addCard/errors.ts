export const missingCardOrExpiryErrorStatusMsg = 'MISSING_CARD_OR_EXPIRY' as const;
export const invalidCardOrExpiryErrorStatusMsg = 'INVALID_CARD_OR_EXPIRY' as const;
export const unauthorizedErrorStatusMsg = 'UNAUTHORIZED' as const;
export const persistenceErrorStatusMsg = 'PERSISTENCE_ERROR' as const;

export type MissingCardOrExpiryError = typeof missingCardOrExpiryErrorStatusMsg;
export type InvalidCardOrExpiryError = typeof invalidCardOrExpiryErrorStatusMsg;
export type UnauthorizedError = typeof unauthorizedErrorStatusMsg;
export type PersistenceError = typeof persistenceErrorStatusMsg;

export type AddCardErrors =
  | MissingCardOrExpiryError
  | InvalidCardOrExpiryError
  | UnauthorizedError
  | PersistenceError;
