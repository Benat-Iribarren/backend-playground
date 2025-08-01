import { User, Phone, Nin } from '../model/userType';

export interface UserStorage {
  userNinExists(nin: Nin): Promise<boolean>;
  userIsBlocked(user: User): Promise<boolean>;
  userPhoneExists(phone: Phone): Promise<boolean>;
}
