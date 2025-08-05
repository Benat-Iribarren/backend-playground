import db from '../dbClient';
import { User, Phone, Nin } from '../../../domain/model/user';
import { UserRepository } from '../../../domain/interfaces/userRespository';

export const userRepository: UserRepository = {
  async ninExistsInDB(nin: Nin): Promise<boolean> {
    const ninRow = await db
      .selectFrom('user')
      .selectAll()
      .where('nin', '=', nin)
      .executeTakeFirst();

    return exists(ninRow);
  },
  async userIsBlocked(user: User): Promise<boolean> {
    const userRow = await db
      .selectFrom('user')
      .selectAll()
      .where('nin', '=', user.nin)
      .where('phone', '=', user.phone)
      .executeTakeFirst();

    return Boolean(userRow?.isBlocked);
  },
  async phoneExistsInDB(phone: Phone): Promise<boolean> {
    const phoneRow = await db
      .selectFrom('user')
      .selectAll()
      .where('phone', '=', phone)
      .executeTakeFirst();

    return exists(phoneRow);
  },
};

function exists(
  row: { id: number; nin: Nin; phone: Phone; isBlocked: boolean } | undefined,
): boolean {
  return row != null;
}
