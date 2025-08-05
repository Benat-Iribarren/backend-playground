import crypto from 'crypto';
import { Hash } from '../../domain/model/otpType';

export const generateRandomHash: () => Hash = () => {
  return crypto.randomBytes(32).toString('hex');
};
