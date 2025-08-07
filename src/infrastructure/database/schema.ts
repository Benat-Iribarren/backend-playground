import { VerificationCode, Hash } from '../../domain/model/otp';
import { Token } from '../../domain/model/token';
import { User, UserId } from '../../domain/model/user';
import { Generated } from 'kysely';

export interface otpTable {
  userId: UserId;
  hash: Hash;
  verificationCode: VerificationCode;
  expirationDate: string;
}

export interface tokenTable {
  userId: UserId
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
