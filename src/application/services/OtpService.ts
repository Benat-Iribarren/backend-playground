import { isOtpValid } from '../../infrastructure/helpers/otpValidator';
import { Hash, Otp } from '../../domain/model/otp';
import { Token } from '../../domain/model/token';
import { generateToken, saveToken } from '../../domain/model/token';
import {
  IncorrectHashOrCodeError,
  incorrectHashOrCodeErrorStatusMsg,
} from '../../domain/errors/verifyOtpErrors';
import { OtpRepository } from '../../domain/interfaces/repositories/otpRepository';

export async function processOtpVerificationRequest(
  otpRepository: OtpRepository,
  otp: Otp,
): Promise<IncorrectHashOrCodeError | { token: Token }> {
  if (await otpExpired(otp)) {
    useOtpCode(otpRepository, otp);
    return incorrectHashOrCodeErrorStatusMsg;
  }

  useOtpCode(otpRepository, otp);
  const token: Token = generateToken(otp.hash);
  await saveToken(token);

  return { token };
}

export async function verificationCodeMatchesHash(otpRepository: OtpRepository, otp: Otp) {
  return (await otpRepository.getVerificationCodeByHash(otp.hash)) === otp.verificationCode;
}

export async function hashCodeExists(otpRepository: OtpRepository, hash: Hash) {
  const hashCodeExists = await otpRepository.hashCodeExistsInDb(hash);
  return hashCodeExists;
}

export async function saveOtp(otpRepository: OtpRepository, otp: Otp) {
  const expirationDateString = obtainOtpExpirationDate().toISOString();
  await otpRepository.saveOtpToDb(otp, expirationDateString);
}

const useOtpCode = async (otpRepository: OtpRepository, otp: Otp) => {
  await otpRepository.deleteOtpFromHashCode(otp.hash);
};

const otpExpired = async (otp: Otp) => {
  const otpValid = await isOtpValid(otp);
  const otpExired = !otpValid;
  return otpExired;
};

const obtainOtpExpirationDate = (): Date => {
  const fiveMinutesInMilliseconds = 1000 * 60 * 5;
  return new Date(Date.now() + fiveMinutesInMilliseconds);
};
