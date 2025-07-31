import { User } from '../domain/model/userType';
import { UserStorage } from '../domain/interfaces/userStorage';
import { userRepository } from './database/operations/userOperations';

export const userStorage: UserStorage = {
  async userExists(user: User): Promise<boolean> {
    const userExists = await userRepository.userExistsInDB(user);
    return userExists ?? true;
  },
  async userIsBlocked(user: User): Promise<boolean> {
    const userBlocked = await userRepository.userIsBlocked(user);
    return userBlocked ?? true;
  },
};
