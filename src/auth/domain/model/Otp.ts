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

export function isOtpExpired(otp: Otp): boolean {
  const expiration = new Date(otp.expirationDate);
  return isNaN(expiration.getTime()) || expiration < new Date();
}

export function generateOtpExpirationDate(): ExpirationDate {
  const fiveMinutesInMilliseconds = 1000 * 60 * 5;
  return new Date(Date.now() + fiveMinutesInMilliseconds).toISOString();
}
