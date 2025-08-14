import db from '../dbClient';
import { User, Phone, Nin } from '../../../domain/model/User';
import { UserRepository } from '../../../domain/interfaces/repositories/UserRespository';

export const userRepository: UserRepository = {
  async getUser(nin: Nin, phone: Phone): Promise<User | null> {
    const userRow = await db
      .selectFrom('user')
      .selectAll()
      .where('nin', '=', nin)
      .where('phone', '=', phone)
      .executeTakeFirst();
    if (!userRow) {
      return null;
    }
    return {
      id: userRow.id,
      nin: userRow.nin,
      phone: userRow.phone,
      isBlocked: Boolean(userRow.isBlocked),
    };
  },
};
