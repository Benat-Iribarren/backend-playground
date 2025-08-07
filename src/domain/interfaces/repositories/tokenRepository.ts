import { Token } from '../../model/token';
import { UserId } from '../../model/user';
export interface TokenRepository {
  saveTokenToDb(userId: UserId, token: Token): Promise<void>;
}
