import db from '../dbClient';
import { User, Phone, Nin } from '../../../domain/model/userType';
import { UserRepository } from '../../../domain/interfaces/userRespository';

export const userRepository: UserRepository = {
  async ninExistsInDB(nin: Nin): Promise<boolean> {
    const ninExists = await db
      .selectFrom('user')
      .selectAll()
      .where('nin', '=', nin)
      .executeTakeFirst();

    return ninExists !== undefined && ninExists !== null;
  },
  async userIsBlocked(user: User): Promise<boolean> {
    const userResult = await db
      .selectFrom('user')
      .selectAll()
      .where('nin', '=', user.nin)
      .where('phone', '=', user.phone)
      .executeTakeFirst();

    return Boolean(userResult?.isBlocked);
  },
  async phoneExistsInDB(phone: Phone): Promise<boolean> {
    const phoneExists = await db
      .selectFrom('user')
      .selectAll()
      .where('phone', '=', phone)
      .executeTakeFirst();

    return phoneExists !== undefined && phoneExists !== null;
  },
};
