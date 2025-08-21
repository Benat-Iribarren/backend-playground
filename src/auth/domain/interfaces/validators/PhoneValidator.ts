import { Phone } from '@common/domain/model/User';

export interface PhoneValidator {
  validatePhone(phone: Phone): boolean;
}
