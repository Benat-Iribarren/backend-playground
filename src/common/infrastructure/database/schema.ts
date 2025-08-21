import { VerificationCode, Hash } from '@auth/domain/model/Otp';
import { TokenUser } from '../../domain/model/TokenUser';
import { UserId, Phone } from '../../domain/model/UserParameters';
import { UserAuth } from '@auth/domain/model/UserAuth';
import { Generated } from 'kysely';

export interface otpTable {
  userId: UserId;
  hash: Hash;
  verificationCode: VerificationCode;
  expirationDate: string;
}

export interface tokenTable {
  userId: UserId;
  token: TokenUser;
}

export interface userTable {
  id: Generated<number>;
  nin: UserAuth['nin'];
  isBlocked: boolean;
  fullName: string;
  email: string;
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
