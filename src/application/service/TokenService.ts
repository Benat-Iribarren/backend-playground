import { Token } from '../../domain/model/token';
import { HashCode } from '../../domain/model/hashCode';
import { generateTokenGivenHash } from '../../infrastructure/helpers/tokenGenerator';

export const generateToken: (hash: HashCode) => Token = (hash: HashCode) => {
  return generateTokenGivenHash(hash);
};
