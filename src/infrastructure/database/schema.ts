export interface OtpTable {
    hash: string;
    otpCode: string;
    expirationDate: Date;
}
export interface Database {
    otp: OtpTable;
}