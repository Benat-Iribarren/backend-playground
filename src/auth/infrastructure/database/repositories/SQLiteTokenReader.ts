import db from '@common/infrastructure/database/dbClient';
import { TokenReader } from '@auth/domain/interfaces/repositories/TokenReader';
import { TokenUser } from '@common/domain/model/TokenUser';
import { UserId } from '@common/domain/model/UserParameters';

export const tokenReader: TokenReader = {
  async getUserIdByToken(token: TokenUser): Promise<UserId | null> {
    const row = await db
      .selectFrom('token')
      .select('userId')
      .where('token', '=', token)
      .executeTakeFirst();
    return row?.userId ?? null;
  },
};
