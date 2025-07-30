import crypto from 'crypto';
import { Hash } from '../../domain/model/hashType';

export const generateRandomHash: () => Hash = () => {
  return crypto.randomBytes(32).toString('hex');
};
