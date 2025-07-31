import { User } from '../model/userType';

export interface UserRepository {
  userExistsInDB(user: User): Promise<boolean | null>;
  userIsBlocked(user: User): Promise<boolean | null>;
}
