import { TokenUser } from '@common/domain/model/TokenUser';
import { UserId } from '@common/domain/model/UserParameters';

export interface TokenRepository {
  saveToken(userId: UserId, token: TokenUser): Promise<void>;
  getUserIdByToken(token: TokenUser): Promise<UserId | null>;
}
