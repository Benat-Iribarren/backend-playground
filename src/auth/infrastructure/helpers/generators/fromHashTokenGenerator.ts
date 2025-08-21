import { TokenGenerator } from '../../../domain/interfaces/generators/TokenGenerator';
import { Hash } from '../../../domain/model/Otp';
import { TokenUser } from '../../../../common/domain/model/TokenUser';
import crypto from 'crypto';

export const tokenGenerator: TokenGenerator = {
  generateToken: (hash: Hash): TokenUser => {
    return crypto.createHash('sha256').update(hash).digest('hex');
  },
};
