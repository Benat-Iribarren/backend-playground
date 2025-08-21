export type Phone = string;
export type Nin = string;
export type UserId = number;
export type email = string;
export type fullName = string;

interface User {
  id: UserId;
  nin: Nin;
  isBlocked: boolean;
  email: string;
  fullName: string;
}

export type AuthUser = Omit<User, 'email' | 'fullName'>;
export type ProfileUser = Pick<User, 'isBlocked'>;
