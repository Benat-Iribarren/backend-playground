import { User, Phone, Nin, UserId } from '../../model/User';

export interface UserRepository {
  getUser(nin: Nin): Promise<User | null>;
  isUserPhoneRegistered(userId: UserId, phone: Phone): Promise<boolean>;
}
