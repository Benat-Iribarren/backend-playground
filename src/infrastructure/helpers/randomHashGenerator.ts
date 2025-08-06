import crypto from 'crypto';
import { HashGenerator } from '../../domain/interfaces/hashGenerator';

export const randomHashGenerator: HashGenerator = {
  generateHash: () => {
    return crypto.randomBytes(32).toString('hex');
  },
};
