import { FastifyInstance } from 'fastify';
import { build } from '@common/infrastructure/server/serverBuild';
import { otpRepository } from '../../../../database/repositories/SQLiteOtpRepository';
import { tokenGenerator } from '../../../../helpers/generators/fromHashTokenGenerator';
import { VERIFY_OTP_ENDPOINT } from '../../verifyOtp';
import { tokenRepository } from '../../../../database/repositories/SQLiteTokenRepository';
import { isOtpExpired } from '../../../../../domain/model/Otp';

jest.mock('../../../../../domain/model/Otp', () => ({
  ...jest.requireActual('../../../../../domain/model/Otp'),
  isOtpExpired: jest.fn(() => false),
}));

describe('verifyOtp', () => {
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

  test('should return a token when introducing a correct hash and verification code', async () => {
    const userId = 1;
    const hash = '9d2bff5d9dfdacfaa4a39e2a6d7f98ea5bd89f5d311986a50f24ee542ba9e221';
    const verificationCode = '123456';
    const token = 'token';
    const expirationDate = 'notExpiredDate';

    const getOtpSpy = jest.spyOn(otpRepository, 'getOtp').mockResolvedValue({
      userId,
      verificationCode,
      hash,
      expirationDate,
    });

    (isOtpExpired as jest.Mock).mockReturnValue(false);
    jest.spyOn(otpRepository, 'deleteOtp').mockResolvedValue();
    jest.spyOn(tokenGenerator, 'generateToken').mockReturnValue(token);
    jest.spyOn(tokenRepository, 'saveToken').mockResolvedValue();

    const response = await app.inject({
      method: 'POST',
      url: VERIFY_OTP_ENDPOINT,
      payload: { hash: hash, verificationCode: verificationCode },
    });
    const data = response.json();

    expect(response.statusCode).toBe(201);
    expect(data).toHaveProperty('token');
    expect(data.token).toBe(token);
    expect(getOtpSpy).toHaveBeenCalledWith(verificationCode, hash);
    expect(isOtpExpired).toHaveBeenCalledWith({
      userId,
      verificationCode,
      hash,
      expirationDate,
    });
  });

  test('should return missing hash or verification code error when introducing an empty hash', async () => {
    const hash = '';
    const verificationCode = '123456';

    const response = await app.inject({
      method: 'POST',
      url: VERIFY_OTP_ENDPOINT,
      payload: { hash: hash, verificationCode: verificationCode },
    });
    const data = response.json();

    expect(response.statusCode).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Missing hash or verification code.');
  });

  test('should return missing hash or verification code error when introducing an empty verification code', async () => {
    const hash = '9d2bff5d9dfdacfaa4a39e2a6d7f98ea5bd89f5d311986a50f24ee542ba9e221';
    const verificationCode = '';

    const response = await app.inject({
      method: 'POST',
      url: VERIFY_OTP_ENDPOINT,
      payload: { hash: hash, verificationCode: verificationCode },
    });
    const data = response.json();

    expect(response.statusCode).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Missing hash or verification code.');
  });

  test('should return missing hash or verification code error when introducing no body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: VERIFY_OTP_ENDPOINT,
      payload: {},
    });
    const data = response.json();

    expect(response.statusCode).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Missing hash or verification code.');
  });

  test('should return invalid hash or verification code error when hash has improper format', async () => {
    const hash = 'hash';
    const verificationCode = '123456';

    const response = await app.inject({
      method: 'POST',
      url: VERIFY_OTP_ENDPOINT,
      payload: { hash: hash, verificationCode: verificationCode },
    });
    const data = response.json();

    expect(response.statusCode).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Invalid hash or verification code.');
  });

  test('should return invalid hash or verification code error when verification code has improper format', async () => {
    const hash = '9d2bff5d9dfdacfaa4a39e2a6d7f98ea5bd89f5d311986a50f24ee542ba9e221';
    const verificationCode = 'verification code';

    const response = await app.inject({
      method: 'POST',
      url: VERIFY_OTP_ENDPOINT,
      payload: { hash: hash, verificationCode: verificationCode },
    });
    const data = response.json();

    expect(response.statusCode).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Invalid hash or verification code.');
  });

  test('should return incorrect hash or verification code error when introducing incorrect parameters', async () => {
    const hash = '9d2bff5d9dfdacfaa4a39e2a6d7f98ea5bd89f5d311986a50f24ee542ba9e221';
    const verificationCode = '123456';
    const getOtpSpy = jest.spyOn(otpRepository, 'getOtp').mockResolvedValue(null);

    const response = await app.inject({
      method: 'POST',
      url: VERIFY_OTP_ENDPOINT,
      payload: { hash: hash, verificationCode: verificationCode },
    });
    const data = response.json();

    expect(response.statusCode).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Incorrect hash or verification code.');
    expect(getOtpSpy).toHaveBeenCalledWith(verificationCode, hash);
  });

  test('should return incorrect hash or verification code error when the verification code is expired', async () => {
    const userId = 1;
    const hash = '9d2bff5d9dfdacfaa4a39e2a6d7f98ea5bd89f5d311986a50f24ee542ba9e221';
    const verificationCode = '123456';
    const expirationDate = new Date(Date.now() - 1000).toISOString();
    const getOtpSpy = jest.spyOn(otpRepository, 'getOtp').mockResolvedValue({
      userId,
      verificationCode,
      hash,
      expirationDate,
    });
    jest.spyOn(otpRepository, 'deleteOtp').mockResolvedValue();
    (isOtpExpired as jest.Mock).mockReturnValue(true);

    const response = await app.inject({
      method: 'POST',
      url: VERIFY_OTP_ENDPOINT,
      payload: { hash: hash, verificationCode: verificationCode },
    });
    const data = response.json();

    expect(response.statusCode).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Incorrect hash or verification code.');
    expect(getOtpSpy).toHaveBeenCalledWith(verificationCode, hash);
    expect(isOtpExpired).toHaveBeenCalledWith({
      userId,
      verificationCode,
      hash,
      expirationDate,
    });
  });

  test('should return internal server error when the database malfunctions', async () => {
    const hash = '9d2bff5d9dfdacfaa4a39e2a6d7f98ea5bd89f5d311986a50f24ee542ba9e221';
    const verificationCode = '123456';

    jest.spyOn(otpRepository, 'getOtp').mockRejectedValue(new Error('Database error'));

    const response = await app.inject({
      method: 'POST',
      url: VERIFY_OTP_ENDPOINT,
      payload: { hash: hash, verificationCode: verificationCode },
    });
    const data = response.json();

    expect(response.statusCode).toBe(500);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Internal Server Error');
  });
});
