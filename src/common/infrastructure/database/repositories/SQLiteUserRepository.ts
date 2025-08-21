import db from '../dbClient';
import { Phone, Nin, UserId } from '../../../domain/model/UserParameters';
import { UserRepository } from '../../../domain/interfaces/repositories/UserRespository';
import { UserAuth } from '@auth/domain/model/UserAuth';
export const userRepository: UserRepository = {
  async getUser(nin: Nin): Promise<UserAuth | null> {
    const userRow = await db
      .selectFrom('user')
      .selectAll()
      .where('nin', '=', nin)
      .executeTakeFirst();
    if (!userRow) {
      return null;
    }
    return {
      id: userRow.id,
      nin: userRow.nin,
      isBlocked: Boolean(userRow.isBlocked),
    };
  },
  async isUserPhoneRegistered(userId: UserId, phone: Phone): Promise<boolean> {
    const phoneMatch = await db
      .selectFrom('phone')
      .selectAll()
      .where('userId', '=', userId)
      .where('phoneNumber', '=', phone)
      .executeTakeFirst();
    return !!phoneMatch;
  },
};
