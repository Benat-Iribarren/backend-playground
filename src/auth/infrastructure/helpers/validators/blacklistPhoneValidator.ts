import { PhoneValidator } from '../../../domain/interfaces/validators/PhoneValidator';
import { Phone } from '@common/domain/model/User';

const blacklistedPhones: Phone[] = ['111111111', '111111121', '666666668'];

export const phoneValidator: PhoneValidator = {
  validatePhone(phone: Phone): boolean {
    return !blacklistedPhones.includes(phone);
  },
};
