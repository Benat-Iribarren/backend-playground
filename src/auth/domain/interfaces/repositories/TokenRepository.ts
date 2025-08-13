import { Token } from '../../model/Token';
import { UserId } from '../../model/User';
export interface TokenRepository {
  saveToken(userId: UserId, token: Token): Promise<void>;
}
