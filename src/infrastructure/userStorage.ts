import { User, Phone, Nin } from '../domain/model/userType';
import { UserStorage } from '../domain/interfaces/userStorage';
import { userRepository } from './database/operations/userOperations';

export const userStorage: UserStorage = {
  async userNinExists(nin: Nin): Promise<boolean> {
    const userExists = await userRepository.ninExistsInDB(nin);
    return userExists ?? true;
  },
  async userIsBlocked(user: User): Promise<boolean> {
    const userBlocked = await userRepository.userIsBlocked(user);
    return userBlocked ?? true;
  },
  async userPhoneExists(phone: Phone): Promise<boolean> {
    const userExists = await userRepository.phoneExistsInDB(phone);
    return userExists ?? true;
  },
};
