import { VerificationCode, Hash } from '../../domain/model/otpType';
import { Token } from '../../domain/model/token';
import { User } from '../../domain/model/user';
import { Generated } from 'kysely';

export interface otpTable {
  hash: Hash;
  verificationCode: VerificationCode;
  expirationDate: string;
}

export interface tokenTable {
  token: Token;
}

export interface userTable {
  id: Generated<number>;
  nin: User['nin'];
  phone: User['phone'];
  isBlocked: boolean;
}

export interface Database {
  otp: otpTable;
  token: tokenTable;
  user: userTable;
}
