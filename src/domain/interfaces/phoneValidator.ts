import { Phone } from '../model/User';

export interface PhoneValidator {
  validatePhone(phone: Phone): boolean;
}
