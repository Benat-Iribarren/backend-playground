import { isOtpValid } from '../../infrastructure/helpers/otpValidator';
import { Hash, Otp, VerificationCode } from '../../domain/model/otp';
import { Token } from '../../domain/model/token';
import {
  IncorrectHashOrCodeError,
  incorrectHashOrCodeErrorStatusMsg,
} from '../../domain/errors/verifyOtpErrors';
import { OtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { getToken } from './tokenService';
import { useOtpCode } from './otpService';
import { TokenRepository } from '../../domain/interfaces/repositories/tokenRepository';

export async function processOtpVerificationRequest(
  otpRepository: OtpRepository,
  tokenRepository: TokenRepository,
  otp: Otp,
): Promise<IncorrectHashOrCodeError | { token: Token }> {
  if (await otpExpired(otp)) {
    useOtpCode(otpRepository, otp);
    return incorrectHashOrCodeErrorStatusMsg;
  }

  return await getToken(otpRepository, tokenRepository, otp);
}

const otpExpired = async (otp: Otp) => {
  const otpValid = await isOtpValid(otp);
  const otpExired = !otpValid;
  return otpExired;
};
