import db from '@common/infrastructure/database/dbClient';
import { TokenUser } from '@common/domain/model/TokenUser';
import { TokenRepository } from '../../../domain/interfaces/repositories/TokenRepository';
import { UserId } from '@common/domain/model/UserParameters';

export const tokenRepository: TokenRepository = {
  async saveToken(userId: UserId, token: TokenUser) {
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
  async getUserIdByToken(token: TokenUser): Promise<UserId | null> {
    const row = await db
      .selectFrom('token')
      .select('userId')
      .where('token', '=', token)
      .executeTakeFirst();
    return row?.userId ?? null;
  },
};
