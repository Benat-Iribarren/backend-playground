import { Hash } from '../../../../auth/domain/model/Otp';
import { TokenUser } from '@common/domain/model/TokenUser';

export interface TokenGenerator {
  generateToken(hash: Hash): TokenUser;
}
