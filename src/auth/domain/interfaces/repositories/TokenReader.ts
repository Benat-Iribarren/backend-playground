import { TokenUser } from '@common/domain/model/TokenUser';
import { UserId } from '@common/domain/model/UserParameters';

export interface TokenReader {
  getUserIdByToken(token: TokenUser): Promise<UserId | null>;
}
