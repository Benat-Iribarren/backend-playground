import { TokenGenerator } from '../../../domain/interfaces/generators/TokenGenerator';
import { Hash } from '../../../domain/model/Otp';
import { Token } from '../../../domain/model/Token';
import crypto from 'crypto';

export const tokenGeneratorFromHash: TokenGenerator = {
  generateToken: (hash: Hash): Token => {
    return crypto.createHash('sha256').update(hash).digest('hex');
  },
};
