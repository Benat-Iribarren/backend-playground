import { VerificationCode, Hash } from '@auth/domain/model/Otp';
import { TokenUser } from '../../domain/model/TokenUser';
import { UserId, Phone } from '../../domain/model/UserParameters';
import { UserAuth } from '@auth/domain/model/UserAuth';
import { Generated } from 'kysely';
import { IsPrimary } from '@user/domain/model/Card';

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

export interface cardTable {
  id: Generated<number>;
  userId: UserId;
  lastFourDigits: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  token: string;
  isPrimary: boolean;
}

export interface phoneTable {
  id: Generated<number>;
  userId: UserId;
  phoneNumber: Phone;
  isPrimary: IsPrimary;
}

export interface Database {
  otp: otpTable;
  token: tokenTable;
  user: userTable;
  card: cardTable;
  phone: phoneTable;
}
