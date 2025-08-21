import { UserAuth } from '@auth/domain/model/UserAuth';
import { Phone, Nin, UserId } from '@common/domain/model/UserParameters';
import { UserProfile } from '@src/user/domain/model/UserProfile';

export interface UserRepository {
  getUser(nin: Nin): Promise<UserAuth | null>;
  getProfile(userId: UserId): Promise<UserProfile | null>;
  isUserPhoneRegistered(userId: UserId, phone: Phone): Promise<boolean>;
}
