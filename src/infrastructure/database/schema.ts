import { HashCode } from "../../domain/model/hashCode";
import { Otp } from "../../domain/model/otpType";
import { Token } from "../../domain/model/token";

export interface otpTable {
  hash: HashCode;
  otp: Otp;
  expirationDate: string;
}

export interface tokenTable {
  hash: HashCode;
  token: Token;
}

export interface Database {
  otp: otpTable;
  token: tokenTable;
}
