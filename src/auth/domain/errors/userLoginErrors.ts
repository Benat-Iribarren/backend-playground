export const userBlockedErrorStatusMsg = 'USER_BLOCKED' as const;
export const userNotFoundErrorStatusMsg = 'USER_NOT_FOUND' as const;

export type UserBlockedError = typeof userBlockedErrorStatusMsg;
export type UserNotFoundError = typeof userNotFoundErrorStatusMsg;

export type UserLoginErrors = UserBlockedError | UserNotFoundError;
