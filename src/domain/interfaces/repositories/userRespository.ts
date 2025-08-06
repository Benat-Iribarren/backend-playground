import { User, Phone, Nin } from '../../model/user';

export interface UserRepository {
  ninExistsInDB(nin: Nin): Promise<boolean | null>;
  userIsBlocked(user: User): Promise<boolean | null>;
  phoneExistsInDB(phone: Phone): Promise<boolean | null>;
}
