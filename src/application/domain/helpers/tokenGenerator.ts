import { Token } from '../../../domain/model/token';
import { HashCode } from '../../../domain/model/hashCode';
import crypto from 'crypto';

export const generateTokenGivenHash: (hash: HashCode) => Token = (hash: HashCode) => {
  return crypto.createHash('sha256').update(hash).digest('hex');
};
