export type OtpStorage = {
  saveOtp: (phone: string, otp: Otp) => void;
  codeExists: (otp: Otp) => boolean;
  useOtp: (phone: string, otp: Otp) => boolean;
};
export type Otp = string;