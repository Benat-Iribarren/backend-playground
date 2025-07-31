import db from '../dbClient';
import { User } from '../../../domain/model/userType';
import { UserRepository } from '../../../domain/interfaces/userRespository';

export const userRepository: UserRepository = {
  async userExistInDB(user: User): Promise<boolean> {
    const userExist = await db
      .selectFrom('user')
      .selectAll()
      .where('nin', '=', user.nin)
      .where('phone', '=', user.phone)
      .executeTakeFirst();

    return userExist !== undefined && userExist !== null;
  },
  async userIsBlocked(user: User): Promise<boolean> {
    const result = await db
      .selectFrom('user')
      .selectAll()
      .where('nin', '=', user.nin)
      .where('phone', '=', user.phone)
      .executeTakeFirst();

    return result?.isBlocked === true;
  }
};
