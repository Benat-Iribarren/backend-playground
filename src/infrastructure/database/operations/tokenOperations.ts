import db from '../dbClient';
import { Token } from '../../../domain/model/tokenType';
import { Hash } from '../../../domain/model/hashType';
import { TokenRepository } from '../../../domain/interfaces/tokenRepository';

export const tokenRepository: TokenRepository = {
  async saveTokenToDb(hash: Hash, token: Token) {
    await db
      .insertInto('token')
      .values({
        hash,
        token,
      })
      .execute();
  },
};
