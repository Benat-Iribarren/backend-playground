import { Hash } from '../../domain/model/Otp';
import { Token } from '../../domain/model/Token';
import crypto from 'crypto';

export const generateTokenGivenHash: (hash: Hash) => Token = (hash: Hash) => {
  return crypto.createHash('sha256').update(hash).digest('hex');
};
