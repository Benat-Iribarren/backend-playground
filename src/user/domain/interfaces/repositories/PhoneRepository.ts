import { Phone, UserId } from '@common/domain/model/UserParameters';
import { IsPrimary } from '@user/domain/model/Card';

export interface PhoneRepository {
  getPhones(userId: UserId): Promise<{ phoneNumber: Phone; isPrimary: IsPrimary }[] | null>;
  isUserPhoneRegistered(userId: UserId, phone: Phone): Promise<boolean>;
}
