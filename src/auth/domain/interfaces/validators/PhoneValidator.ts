import { Phone } from '@common/domain/model/UserParameters';

export interface PhoneValidator {
  validatePhone(phone: Phone): boolean;
}
