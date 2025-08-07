import { Hash, Otp, VerificationCode } from '../../domain/model/otp';
import { Token } from '../../domain/model/token';
import {
  IncorrectHashOrCodeError,
  incorrectHashOrCodeErrorStatusMsg,
} from '../../domain/errors/verifyOtpErrors';
import { OtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { TokenRepository } from '../../domain/interfaces/repositories/tokenRepository';
import { generateToken } from '../factories/TokenFactory';
import { UserId } from '../../domain/model/user';

export async function processOtpVerificationRequest(
  otpRepository: OtpRepository,
  tokenRepository: TokenRepository,
  otp: Otp,
): Promise<IncorrectHashOrCodeError | { token: Token }> {
  if (await otpExpired(otpRepository, otp)) {
    useOtpCode(otpRepository, otp);
    return incorrectHashOrCodeErrorStatusMsg;
  }

  useOtpCode(otpRepository, otp);
  const token: Token = generateToken(otp.hash);
  await saveToken(tokenRepository, token);

  return { token };
}

export async function verificationCodeExists(
  otpRepository: OtpRepository,
  verificationCode: VerificationCode,
) {
  return await otpRepository.verificationCodeExists(verificationCode);
}

export async function verificationCodeMatchesHash(otpRepository: OtpRepository, otp: Otp) {
  return (await otpRepository.getVerificationCodeByHash(otp.hash)) === otp.verificationCode;
}

export async function hashCodeExists(otpRepository: OtpRepository, hash: Hash) {
  const hashCodeExists = await otpRepository.hashCodeExists(hash);
  return hashCodeExists;
}

export async function saveOtp(otpRepository: OtpRepository, userId: UserId, otp: Otp) {
  const expirationDateString = obtainOtpExpirationDate().toISOString();
  await otpRepository.saveOtp(userId, otp, expirationDateString);
}

const useOtpCode = async (otpRepository: OtpRepository, otp: Otp) => {
  await otpRepository.deleteOtpFromHashCode(otp.hash);
};

const otpExpired = async (otpRepository: OtpRepository, otp: Otp): Promise<boolean> => {
  const expiration = await otpRepository.getExpirationDate(otp.hash);
  if (!expiration) return true;

  const now = new Date();
  const expiresAt = new Date(expiration);
  return expiresAt <= now;
};

const obtainOtpExpirationDate = (): Date => {
  const fiveMinutesInMilliseconds = 1000 * 60 * 5;
  return new Date(Date.now() + fiveMinutesInMilliseconds);
};

async function saveToken(tokenRepository: TokenRepository, token: Token): Promise<void> {
  await tokenRepository.saveTokenToDb(token);
}