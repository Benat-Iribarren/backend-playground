import { User } from '../model/userType';

export interface UserStorage {
  userExists(user: User): Promise<boolean>;
  userIsBlocked(user: User): Promise<boolean>;
}
