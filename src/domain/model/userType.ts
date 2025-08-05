import { userRepository } from "../../infrastructure/database/repository/userRepository";

export interface User {
  nin: Nin;
  phone: Phone;
}
export type Phone = string;
export type Nin = string;

export async function userNinNotExists(nin: Nin) {
  const exists = await userRepository.ninExistsInDB(nin);
  return !exists;
}
export async function isUserBlocked(user: User) {
  return await userRepository.userIsBlocked(user);
}
export async function userPhoneNotExists(phone: Phone) {
  const exists = await userRepository.phoneExistsInDB(phone);
  return !exists;
}
