import { FastifyInstance } from 'fastify';
import { build } from '../../../infrastructure/server/serverBuild';
import { processOtpVerificationRequest } from '../verifyOtpService';
import { tokenRepository } from '../../../infrastructure/database/repositories/SQLiteTokenRepository';
import { otpRepository } from '../../../infrastructure/database/repositories/SQLiteOtpRepository';
import { TokenRepository } from '../../../domain/interfaces/repositories/TokenRepository';
import { OtpRepository } from '../../../domain/interfaces/repositories/OtpRepository';
import { TokenGenerator } from '../../../domain/interfaces/generators/TokenGenerator';
import { isOtpExpired } from '../../../domain/model/Otp';
import {
  expiredVerificationCodeErrorStatusMsg,
  otpNotFoundErrorStatusMsg,
} from '../../../domain/errors/otpLoginError';
import { tokenGenerator } from '../../../infrastructure/helpers/generators/fromHashTokenGenerator';

jest.mock('../../../domain/model/Otp', () => ({
  ...jest.requireActual('../../../domain/model/Otp'),
  isOtpExpired: jest.fn(),
}));

describe('verifyOtpService', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = build();
    await app.ready();
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should return a token when the otp is correct', async () => {
    const verificationCode = '123456';
    const hash = 'hash';
    const token = 'token';
    const otp = { userId: 1, verificationCode, hash, expirationDate: 'notExpiredDate' };

    const mockTokenRepository = {
      ...tokenRepository,
      saveToken: jest.fn(async () => {}),
    } as TokenRepository;
    const mockOtpRepository = {
      ...otpRepository,
      getOtp: jest.fn(async () => otp),
      deleteOtp: jest.fn(async () => {}),
    } as OtpRepository;
    const mockTokenGenerator = {
      generateToken: jest.fn(() => token),
    } as TokenGenerator;
    (isOtpExpired as jest.Mock).mockReturnValue(false);

    const serviceResponse = processOtpVerificationRequest(
      { ...mockTokenRepository },
      { ...mockOtpRepository },
      { ...mockTokenGenerator },
      { verificationCode, hash },
    );

    expect(serviceResponse).resolves.toEqual({ token });
  });

  test('should return an expired verification code error status message when the verification code is expired', async () => {
    const verificationCode = '123456';
    const hash = 'hash';
    const otp = { userId: 1, verificationCode, hash, expirationDate: 'notExpiredDate' };
    const mockOtpRepository = {
      ...otpRepository,
      getOtp: jest.fn(async () => otp),
      deleteOtp: jest.fn(async () => {}),
    } as OtpRepository;
    (isOtpExpired as jest.Mock).mockReturnValue(true);

    const serviceResponse = processOtpVerificationRequest(
      tokenRepository,
      { ...mockOtpRepository },
      tokenGenerator,
      { verificationCode, hash },
    );

    expect(serviceResponse).resolves.toEqual(expiredVerificationCodeErrorStatusMsg);
  });

  test('should return an otp not found error status message when the otp does not exist', async () => {
    const verificationCode = '123456';
    const hash = 'hash';
    const mockOtpRepository = {
      ...otpRepository,
      getOtp: jest.fn(async () => null),
    } as OtpRepository;

    const serviceResponse = processOtpVerificationRequest(
      tokenRepository,
      { ...mockOtpRepository },
      tokenGenerator,
      { verificationCode, hash },
    );

    expect(serviceResponse).resolves.toEqual(otpNotFoundErrorStatusMsg);
  });
});
