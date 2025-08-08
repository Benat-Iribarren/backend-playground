import { Token } from '../../model/Token';
import { UserId } from '../../model/User';
export interface TokenRepository {
  saveTokenToDb(userId: UserId, token: Token): Promise<void>;
}
