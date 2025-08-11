export const userBlockedErrorStatusMsg = 'USER_BLOCKED' as const;
export const userNotFoundErrorStatusMsg = 'USER_NOT_FOUND' as const;
export const userPhoneUnavailableForSmsErrorStatusMsg = 'UNAVAILABLE_PHONE' as const;

export type UserPhoneUnavailableError = typeof userPhoneUnavailableForSmsErrorStatusMsg;
export type UserBlockedError = typeof userBlockedErrorStatusMsg;
export type UserNotFoundError = typeof userNotFoundErrorStatusMsg;

export type UserLoginErrors = UserPhoneUnavailableError | UserBlockedError | UserNotFoundError;
