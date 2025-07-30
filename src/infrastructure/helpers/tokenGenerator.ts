import { Token } from '../../domain/model/tokenType';
import { Hash } from '../../domain/model/hashType';
import crypto from 'crypto';

export const generateTokenGivenHash: (hash: Hash) => Token = (hash: Hash) => {
  return crypto.createHash('sha256').update(hash).digest('hex');
};
