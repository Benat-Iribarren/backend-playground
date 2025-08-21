import { UserAuth } from '@auth/domain/model/UserAuth';
import { Phone, Nin, UserId } from '../../model/UserParameters';

export interface UserRepository {
  getUser(nin: Nin): Promise<UserAuth | null>;
  isUserPhoneRegistered(userId: UserId, phone: Phone): Promise<boolean>;
}
