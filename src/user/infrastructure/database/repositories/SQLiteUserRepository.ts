import db from '@common/infrastructure/database/dbClient';
import { Nin, UserId } from '@common/domain/model/UserParameters';
import { UserRepository } from '../../../domain/interfaces/repositories/UserRespository';
import { UserAuth } from '@auth/domain/model/UserAuth';
import { UserProfile } from '@src/user/domain/model/UserProfile';

export const userRepository: UserRepository = {
  async getUser(nin: Nin): Promise<UserAuth | null> {
    const row = await db.selectFrom('user').selectAll().where('nin', '=', nin).executeTakeFirst();
    if (!row) {
      return null;
    }
    return { id: row.id, nin: row.nin, isBlocked: Boolean(row.isBlocked) };
  },

  async getProfile(userId: UserId): Promise<UserProfile | null> {
    const row = await db.selectFrom('user').selectAll().where('id', '=', userId).executeTakeFirst();
    if (!row) {
      return null;
    }
    return { id: row.id, fullName: row.fullName, nin: row.nin, email: row.email };
  },

  async updateProfile(
    userId: UserId,
    patch: Partial<Pick<UserProfile, 'fullName' | 'nin' | 'email'>>,
  ): Promise<boolean> {
    const { fullName, nin, email } = patch;

    if (!fullName && !nin && !email) {
      return false;
    }

    const updates: Record<string, string> = {};
    if (fullName) {
      updates.fullName = fullName;
    }
    if (nin) {
      updates.nin = nin;
    }
    if (email) {
      updates.email = email;
    }

    const result = await db
      .updateTable('user')
      .set(updates)
      .where('id', '=', userId)
      .executeTakeFirst();

    return !!result;
  },
};
