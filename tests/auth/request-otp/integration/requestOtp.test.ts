import { build } from '../../../../src/auth/infrastructure/server/serverBuild';
import { REQUEST_OTP_ENDPOINT } from '../../../../src/auth/infrastructure/endpoints/requestOtp/requestOtp';
import { userRepository } from '../../../../src/auth/infrastructure/database/repository/SQLiteUserRepository';
import { otpRepository } from '../../../../src/auth/infrastructure/database/repository/SQLiteOtpRepository';
import { randomCodeGenerator } from '../../../../src/auth/infrastructure/helpers/generators/randomCodeGenerator';
import { randomHashGenerator } from '../../../../src/auth/infrastructure/helpers/generators/randomHashGenerator';
import { FastifyInstance } from 'fastify/types/instance';

describe('requestOtp endpoint', () => {
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

  test('should return hash and a verificationCode when introducing correct nin and phone number', async () => {
    const nin = '87654321Z';
    const phone = '222222222';
    const userId = 1;
    const hash = 'hash';
    const verificationCode = '123456';
    const expirationDate = new Date(5 * 60 * 1000).toISOString();

    const saveOtpSpy = jest.spyOn(otpRepository, 'saveOtp').mockResolvedValue();
    jest.spyOn(userRepository, 'getUser').mockResolvedValue({
      id: userId,
      nin: nin,
      phone: phone,
      isBlocked: false,
    });
    jest.spyOn(randomCodeGenerator, 'generateSixDigitCode').mockResolvedValue(verificationCode);
    jest.spyOn(randomHashGenerator, 'generateHash').mockReturnValue(hash);
    jest.spyOn(Date, 'now').mockReturnValue(new Date(0).getTime());

    const response = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin: nin, phone: phone },
    });
    const data = response.json();

    expect(response.statusCode).toBe(201);
    expect(data).toHaveProperty('verificationCode');
    expect(data).toHaveProperty('hash');
    expect(data.hash).toBe(hash);
    expect(data.verificationCode).toBe(verificationCode);
    expect(saveOtpSpy).toHaveBeenCalledWith({ userId, verificationCode, hash, expirationDate });
  });

  test('should return missing nin or phone number error when introducing emtpy nin and phone number', async () => {
    const nin = '';
    const phone = '';

    const response = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin: nin, phone: phone },
    });
    const data = response.json();

    expect(response.statusCode).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Missing nin or phone number.');
  });

  test('should return missing nin or phone number error when introducing no body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: {},
    });
    const data = response.json();

    expect(response.statusCode).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Missing nin or phone number.');
  });
});
