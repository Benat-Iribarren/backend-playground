import { UserService } from '../../domain/interfaces/userService';
import { userRepository } from '../../infrastructure/database/operations/userOperations';

export const UserServiceImpl: UserService = {
  async userNinExists(nin) {
    const userExists = await userRepository.ninExistsInDB(nin);
    return userExists ?? true;
  },
  async userBlocked(user) {
    const userBlocked = await userRepository.userIsBlocked(user);
    return userBlocked ?? true;
  },
  async userPhoneExists(phone) {
    const userExists = await userRepository.phoneExistsInDB(phone);
    return userExists ?? true;
  },
};
