export type Phone = string;
export type Nin = string;
export type UserId = number;

export interface User {
  id: UserId;
  nin: Nin;
  isBlocked: boolean;
}
