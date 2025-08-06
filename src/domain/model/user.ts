import { UserRepository } from '../interfaces/repositories/userRespository';

export interface User {
  nin: Nin;
  phone: Phone;
  isBlocked: boolean;
}
export type Phone = string;
export type Nin = string;
export function userNotExists(user: User | null): user is null {
  return user === null;
}
export function isUserBlocked(user: User): boolean {
  return user.isBlocked;
}
export function userPhoneNotExists(phone: Phone) {
  /*const exists = await userRepository.phoneExistsInDB(phone);*/
  return false;
}
