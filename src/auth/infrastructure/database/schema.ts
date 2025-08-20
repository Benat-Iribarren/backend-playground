import { VerificationCode, Hash } from '../../domain/model/Otp';
import { Token } from '../../domain/model/Token';
import { AuthUser, UserId, Phone } from '../../domain/model/User';
import { Generated } from 'kysely';

export interface otpTable {
  userId: UserId;
  hash: Hash;
  verificationCode: VerificationCode;
  expirationDate: string;
}

export interface tokenTable {
  userId: UserId;
  token: Token;
}

export interface userTable {
  id: Generated<number>;
  nin: AuthUser['nin'];
  isBlocked: boolean;
}

export interface phoneTable {
  id: Generated<number>;
  userId: UserId;
  phoneNumber: Phone;
}

export interface Database {
  otp: otpTable;
  token: tokenTable;
  user: userTable;
  phone: phoneTable;
}
