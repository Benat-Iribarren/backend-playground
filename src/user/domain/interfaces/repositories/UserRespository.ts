import { UserAuth } from '@auth/domain/model/UserAuth';
import { Phone, Nin, UserId, isPrimary } from '@common/domain/model/UserParameters';
import { UserProfile } from '@src/user/domain/model/UserProfile';

export interface UserRepository {
  getUser(nin: Nin): Promise<UserAuth | null>;
  getProfile(userId: UserId): Promise<UserProfile | null>;
  updateProfile(
    userId: UserId,
    patch: Partial<Pick<UserProfile, 'fullName' | 'nin' | 'email'>>,
  ): Promise<boolean>;
  isUserPhoneRegistered(userId: UserId, phone: Phone): Promise<boolean>;
  getPhones(userId: UserId): Promise<{ phoneNumber: Phone; isPrimary: isPrimary }[] | null>;
}
