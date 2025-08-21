import { Token } from '../../model/Token';
import { UserId } from '@common/domain/model/UserParameters';

export interface TokenRepository {
  saveToken(userId: UserId, token: Token): Promise<void>;
}
