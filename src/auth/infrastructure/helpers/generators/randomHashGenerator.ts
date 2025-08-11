import crypto from 'crypto';
import { HashGenerator } from '../../../domain/interfaces/generators/HashGenerator';

export const randomHashGenerator: HashGenerator = {
  generateHash: () => {
    return crypto.randomBytes(32).toString('hex');
  },
};
