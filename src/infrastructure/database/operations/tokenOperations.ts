import db from '../dbClient';
import { Token } from '../../../domain/model/tokenType';
import { TokenRepository } from '../../../domain/interfaces/tokenRepository';

export const tokenRepository: TokenRepository = {
  async saveTokenToDb(token: Token) {
    await db
      .insertInto('token')
      .values({
        token,
      })
      .execute();
  },
};
