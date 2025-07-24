import { Otp, OtpStorage } from "../domain/model/otpType";
export const otpStorage: OtpStorage = {
  saveOtp,
  codeExists,
  useOtp,
};

type OtpValue = {
  otp: Otp;
  expirationDate: Date;
};
const Storage = new Map<string, OtpValue>();

function saveOtp(phone: string, otp: Otp) {
  const expirationDate = obtainOtpExpirationDate();
  Storage.set(phone, { otp: otp, expirationDate });
}

const fiveMinutesInMilliseconds = 1000 * 60 * 5;
function obtainOtpExpirationDate(): Date {
  return new Date(Date.now() + fiveMinutesInMilliseconds);
}

function codeExists(otp: Otp): boolean {
  return Storage.has(otp);
}

function useOtp(phone: string, otp: Otp): boolean {
  if (otpNotExpired(phone, otp)) {
    deleteOtp(phone);
    return true;
  }
  if (otpExpired(phone, otp)) {
    deleteOtp(phone);
  }
  return false;

  function otpExpired(phone: string, otp: Otp): boolean {
    return otpMatchesPhone(phone, otp) && isOtpExpired(phone);
  }

  function otpNotExpired(phone: string, otp: Otp): boolean {
    return otpMatchesPhone(phone, otp) && isOtpValid(phone);
  }
}

function isOtpExpired(phone: string): boolean {
  return !isOtpValid(phone);
}

function isOtpValid(phone: string): boolean {
  const otpValue = Storage.get(phone);
  if (otpNotFound(otpValue)) return false;
  return isExpirationDateValid(otpValue!);
}

function isExpirationDateValid(otpValue: OtpValue): boolean {
  return otpValue.expirationDate !== undefined && otpValue.expirationDate > new Date();
}

function otpNotFound(value: OtpValue | undefined): boolean {
  return value === undefined;
}

function otpMatchesPhone(phone: string, otp: Otp): boolean {
  return Storage.has(phone) && Storage.get(phone)?.otp === otp;
}

function deleteOtp(phone: string) {
  Storage.delete(phone);
}
