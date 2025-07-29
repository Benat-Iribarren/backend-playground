import db from '../dbClient';
import { Token } from '../../../domain/model/tokenType';
import { HashCode } from '../../../domain/model/hashCode';
import { TokenRepository } from '../../../domain/interfaces/tokenRepository';

export const tokenRepository: TokenRepository = {
  async saveTokenToDb(hash: HashCode, token: Token) {
    await db
      .insertInto('token')
      .values({
        hash,
        token,
      })
      .execute();
  },
};
