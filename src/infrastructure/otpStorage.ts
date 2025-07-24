import { Otp, OtpStorage } from "../domain/model/otpType";
import { HashCode } from "../domain/model/hashCode";

export const otpStorage: OtpStorage = {
  saveOtp,
  codeExists,
  useOtp,
};

type OtpValue = {
  otp: Otp;
  expirationDate: Date;
};

const Storage = new Map<HashCode, OtpValue>();

function saveOtp(hash: HashCode, otp: Otp) {
  const expirationDate = obtainOtpExpirationDate();
  Storage.set(hash, { otp: otp, expirationDate });
}

const fiveMinutesInMilliseconds = 1000 * 60 * 5;
function obtainOtpExpirationDate(): Date {
  return new Date(Date.now() + fiveMinutesInMilliseconds);
}

function codeExists(otp: Otp): boolean {
  return Storage.has(otp);
}

function useOtp(hash: HashCode, otp: Otp): boolean {
  if (otpNotExpired(hash, otp)) {
    deleteOtp(hash);
    return true;
  }
  if (otpExpired(hash, otp)) {
    deleteOtp(hash);
  }
  return false;

  function otpExpired(hash: HashCode, otp: Otp): boolean {
    return otpMatchesPhone(hash, otp) && isOtpExpired(hash);
  }

  function otpNotExpired(hash: HashCode, otp: Otp): boolean {
    return otpMatchesPhone(hash, otp) && isOtpValid(hash);
  }
}

function isOtpExpired(hash: HashCode): boolean {
  return !isOtpValid(hash);
}

function isOtpValid(hash: HashCode): boolean {
  const otpValue = Storage.get(hash);
  if (otpNotFound(otpValue)) return false;
  return isExpirationDateValid(otpValue!);
}

function isExpirationDateValid(otpValue: OtpValue): boolean {
  return otpValue.expirationDate !== undefined && otpValue.expirationDate > new Date();
}

function otpNotFound(value: OtpValue | undefined): boolean {
  return value === undefined;
}

function otpMatchesPhone(hash: HashCode, otp: Otp): boolean {
  return Storage.has(hash) && Storage.get(hash)?.otp === otp;
}

function deleteOtp(hash: HashCode) {
  Storage.delete(hash);
}
