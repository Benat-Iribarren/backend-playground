export interface User {
  nin: Nin;
  phone: Phone;
  isBlocked: boolean;
}

export type Phone = string;
export type Nin = string;
export type UserId = number;
export type UserWithId = User & { id: UserId };

export function userDoesntExist(user: UserWithId | null): user is null {
  return user === null;
}
export function userIsBlocked(user: User): boolean {
  return user.isBlocked;
}
