import { build } from '../../../../src/auth/infrastructure/server/serverBuild';
import { REQUEST_OTP_ENDPOINT } from '../../../../src/auth/infrastructure/endpoints/requestOtp/requestOtp';
import { userRepository } from '../../../../src/auth/infrastructure/database/repository/SQLiteUserRepository';
import { otpRepository } from '../../../../src/auth/infrastructure/database/repository/SQLiteOtpRepository';
import { codeGenerator } from '../../../../src/auth/infrastructure/helpers/generators/randomCodeGenerator';
import { hashGenerator } from '../../../../src/auth/infrastructure/helpers/generators/randomHashGenerator';
import { FastifyInstance } from 'fastify/types/instance';
import { phoneValidator } from '../../../../src/auth/infrastructure/helpers/validators/blacklistPhoneValidator';

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
    jest.spyOn(codeGenerator, 'generateSixDigitCode').mockResolvedValue(verificationCode);
    jest.spyOn(hashGenerator, 'generateHash').mockReturnValue(hash);
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

  test('should return missing nin or phone number error when introducing an empty nin', async () => {
    const nin = '';
    const phone = '222222222';

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

  test('should return missing nin or phone number error when introducing an empty phone number', async () => {
    const nin = '87654321Z';
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

  test('should return invalid nin or phone number error when nin has importer format', async () => {
    const nin = 'not a valid nin';
    const phone = '222222222';

    const response = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin: nin, phone: phone },
    });
    const data = response.json();

    expect(response.statusCode).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Invalid nin or phone number.');
  });

  test('should return invalid nin or phone number error when phone number has improper format', async () => {
    const nin = '87654321Z';
    const phone = 'not a valid phone number';

    const response = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin: nin, phone: phone },
    });
    const data = response.json();

    expect(response.statusCode).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Invalid nin or phone number.');
  });

  test('should return incorrect nin or phone number error when introducing an incorrect phone number', async () => {
    const nin = '87654321Z';
    const phone = '213456789';

    jest.spyOn(userRepository, 'getUser').mockResolvedValue(null);

    const response = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin: nin, phone: phone },
    });
    const data = response.json();

    expect(response.statusCode).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Incorrect nin or phone number.');
  });

  test('should return incorrect nin or phone number error when introducing an incorrect nin', async () => {
    const nin = '00000000Z';
    const phone = '222222222';

    jest.spyOn(userRepository, 'getUser').mockResolvedValue(null);

    const response = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin: nin, phone: phone },
    });
    const data = response.json();

    expect(response.statusCode).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Incorrect nin or phone number.');
  });

  test('should return incorrect nin or phone number error when a sms cannot be sent to the phone number', async () => {
    const nin = '12312312Z';
    const phone = '222222222';
    const userId = 1;

    jest.spyOn(userRepository, 'getUser').mockResolvedValue({
      id: userId,
      nin: nin,
      phone: phone,
      isBlocked: false,
    });

    const blacklistPhoneValidatorSpy = jest
      .spyOn(phoneValidator, 'validatePhone')
      .mockReturnValue(false);

    const response = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin: nin, phone: phone },
    });
    const data = response.json();

    expect(response.statusCode).toBe(401);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Incorrect nin or phone number.');
    expect(blacklistPhoneValidatorSpy).toHaveBeenCalledWith(phone);
  });

  test('should return user is blocked error when the user is blocked', async () => {
    const nin = '12312312Z';
    const phone = '222222222';
    const userId = 1;

    jest.spyOn(userRepository, 'getUser').mockResolvedValue({
      id: userId,
      nin: nin,
      phone: phone,
      isBlocked: true,
    });

    const response = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin: nin, phone: phone },
    });
    const data = response.json();

    expect(response.statusCode).toBe(403);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('User is blocked.');
  });

  test('should return internal server error when the database malfunctions', async () => {
    const nin = '12312312Z';
    const phone = '222222222';

    jest.spyOn(userRepository, 'getUser').mockRejectedValue(new Error('Database error'));

    const response = await app.inject({
      method: 'POST',
      url: REQUEST_OTP_ENDPOINT,
      payload: { nin: nin, phone: phone },
    });
    const data = response.json();

    expect(response.statusCode).toBe(500);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Internal Server Error');
  });
});
