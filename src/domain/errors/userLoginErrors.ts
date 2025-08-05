export const userBlockedErrorMsg = 'USER_BLOCKED' as const;
export const userNotFoundErrorMsg = 'USER_NOT_FOUND' as const;

export type UserBlockedError = typeof userBlockedErrorMsg;
export type UserNotFoundError = typeof userNotFoundErrorMsg;

export type UserLoginErrors = UserBlockedError | UserNotFoundError;
