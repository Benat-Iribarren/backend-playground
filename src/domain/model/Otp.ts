import { UserId } from './User';
export type VerificationCode = string;
export type Hash = string;
export type ExpirationDate = string;

export type Otp = {
  userId: UserId;
  verificationCode: VerificationCode;
  hash: Hash;
  expirationDate: ExpirationDate;
};
