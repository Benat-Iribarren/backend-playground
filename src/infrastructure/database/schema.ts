import { Hash } from '../../domain/model/hashType';
import { Otp } from '../../domain/model/otpType';
import { Token } from '../../domain/model/tokenType';
import { User } from '../../domain/model/userType';
import { Generated } from 'kysely';

export interface otpTable {
  hash: Hash;
  otp: Otp;
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
