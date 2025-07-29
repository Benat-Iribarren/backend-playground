import { Token } from '../../domain/model/tokenType';
import { HashCode } from '../../domain/model/hashCode';
import { generateTokenGivenHash } from '../../infrastructure/helpers/tokenGenerator';
import { TokenService } from '../../domain/interfaces/tokenService';
import { tokenStorage } from '../../infrastructure/tokenStorage';

export const TokenServiceImpl: TokenService = {
  async saveToken(hash, token) {
    return tokenStorage.saveToken(hash, token);
  },
  generateToken(hash: HashCode): Token {
    return generateTokenGivenHash(hash);
  }
};
