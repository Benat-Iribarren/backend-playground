import { Hash } from '../../domain/model/hashType';
import { Otp } from '../../domain/model/otpType';
import { Token } from '../../domain/model/tokenType';

export interface otpTable {
  hash: Hash;
  otp: Otp;
  expirationDate: string;
}

export interface tokenTable {
  hash: Hash;
  token: Token;
}

export interface Database {
  otp: otpTable;
  token: tokenTable;
}
