import crypto from 'crypto';
import { HashCode } from '../model/hashCode';

export const generateRandomHash: () => HashCode = () => {
  return crypto.randomBytes(32).toString('hex');
};
