export type VerificationCode = string;
export type Hash = string;
export type Otp = {
  verificationCode: VerificationCode;
  hash: Hash;
};
