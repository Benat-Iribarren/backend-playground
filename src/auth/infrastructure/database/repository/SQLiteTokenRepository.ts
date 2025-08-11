import db from '../dbClient';
import { Token } from '../../../domain/model/Token';
import { TokenRepository } from '../../../domain/interfaces/repositories/TokenRepository';
import { UserId } from '../../../domain/model/User';

export const tokenRepository: TokenRepository = {
  async saveTokenToDb(userId: UserId, token: Token) {
    const existing = await db
      .selectFrom('token')
      .select('userId')
      .where('userId', '=', userId)
      .executeTakeFirst();

    if (existing) {
      await db
        .updateTable('token')
        .set({
          token,
        })
        .where('userId', '=', userId)
        .execute();
    } else {
      await db
        .insertInto('token')
        .values({
          userId,
          token,
        })
        .execute();
    }
  },
};
