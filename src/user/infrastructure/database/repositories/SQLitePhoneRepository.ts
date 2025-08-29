import db from '@common/infrastructure/database/dbClient';
import { Phone, UserId } from '@common/domain/model/UserParameters';
import { PhoneRepository } from '@user/domain/interfaces/repositories/PhoneRepository';
import { IsPrimary } from '@user/domain/model/Card';

export const phoneRepository: PhoneRepository = {
  async getPhones(userId: UserId): Promise<{ phoneNumber: Phone; isPrimary: IsPrimary }[] | null> {
    const rows = await db.selectFrom('phone').selectAll().where('userId', '=', userId).execute();
    if (!rows || rows.length === 0) {
      return null;
    }
    return rows.map((row) => ({
      phoneNumber: row.phoneNumber,
      isPrimary: Boolean(row.isPrimary),
    }));
  },

  async isUserPhoneRegistered(userId: UserId, phone: Phone): Promise<boolean> {
    const phoneMatch = await db
      .selectFrom('phone')
      .select('id')
      .where('userId', '=', userId)
      .where('phoneNumber', '=', phone)
      .executeTakeFirst();
    return !!phoneMatch;
  },
};
