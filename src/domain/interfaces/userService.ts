import { User, Phone, Nin } from '../model/userType';

export interface UserService {
  userNinExists(nin: Nin): Promise<boolean>;
  userPhoneExists(phone: Phone): Promise<boolean>;
  userBlocked(user: User): Promise<boolean>;
}
