export interface otpTable {
  hash: string;
  otp: string;
  expirationDate: string;
}
export interface Database {
  otp: otpTable;
}
