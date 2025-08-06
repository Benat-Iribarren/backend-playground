import { UserRepository } from "../interfaces/userRespository";

export interface User {
  nin: Nin;
  phone: Phone;
}
export type Phone = string;
export type Nin = string;

export async function userNinNotExists(userRepository: UserRepository, nin: Nin) {
  const exists = await userRepository.ninExistsInDB(nin);
  return !exists;
}
export async function isUserBlocked(userRepository: UserRepository, user: User) {
  return await userRepository.userIsBlocked(user);
}
export async function userPhoneNotExists(userRepository: UserRepository, phone: Phone) {
  const exists = await userRepository.phoneExistsInDB(phone);
  return !exists;
}
