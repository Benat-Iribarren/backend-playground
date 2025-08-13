import { FastifyInstance } from 'fastify';
import { build } from '../../../../src/auth/infrastructure/server/serverBuild';
import { otpRepository } from '../../../../src/auth/infrastructure/database/repository/SQLiteOtpRepository';
import { tokenGenerator } from '../../../../src/auth/infrastructure/helpers/generators/fromHashTokenGenerator';
import { VERIFY_OTP_ENDPOINT } from '../../../../src/auth/infrastructure/endpoints/verifyOtp/verifyOtp';
import { tokenRepository } from '../../../../src/auth/infrastructure/database/repository/SQLiteTokenRepository';

describe('verifyOtp endpoint', () => {
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
    const expirationDate = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const getOtpSpy = jest.spyOn(otpRepository, 'getOtp').mockResolvedValue({
      userId,
      verificationCode,
      hash,
      expirationDate,
    });
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
  });
});
