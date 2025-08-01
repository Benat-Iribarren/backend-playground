import { UserService } from '../../domain/interfaces/userService';
import { userStorage } from '../../infrastructure/userStorage';

export const UserServiceImpl: UserService = {
  async userNinExists(nin) {
    return userStorage.userNinExists(nin);
  },
  async userBlocked(user) {
    return userStorage.userIsBlocked(user);
  },
  async userPhoneExists(phone) {
    return userStorage.userPhoneExists(phone);
  },
};
