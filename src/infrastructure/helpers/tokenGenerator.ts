import { Hash } from '../../domain/model/otpType';
import { Token } from '../../domain/model/token';
import crypto from 'crypto';

export const generateTokenGivenHash: (hash: Hash) => Token = (hash: Hash) => {
  return crypto.createHash('sha256').update(hash).digest('hex');
};
