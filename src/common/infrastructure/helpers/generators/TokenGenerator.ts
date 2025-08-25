import { CardNumber } from '@user/domain/model/Card';
import { TokenGenerator } from '../../../domain/interfaces/generators/TokenGenerator';
import { Hash } from '../../../../auth/domain/model/Otp';
import { TokenUser } from '@common/domain/model/TokenUser';
import crypto from 'crypto';

export const tokenGenerator: TokenGenerator = {
  generateToken: (code: Hash | CardNumber): TokenUser => {
    return crypto.createHash('sha256').update(code).digest('hex');
  },
};
