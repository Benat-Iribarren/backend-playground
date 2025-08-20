import { FastifyInstance } from 'fastify';
import { build } from '../../../infrastructure/server/serverBuild';
import { processOtpRequest } from '../requestOtpService';
import { otpRepository } from '../../../infrastructure/database/repositories/SQLiteOtpRepository';
import { codeGenerator } from '../../../infrastructure/helpers/generators/randomCodeGenerator';
import { hashGenerator } from '../../../infrastructure/helpers/generators/randomHashGenerator';
import { phoneValidator } from '../../../infrastructure/helpers/validators/blacklistPhoneValidator';
import { UserRepository } from '../../../domain/interfaces/repositories/UserRespository';
import {
  userBlockedErrorStatusMsg,
  userNotFoundErrorStatusMsg,
  userPhoneUnavailableForSmsErrorStatusMsg,
} from '../../../domain/errors/userLoginErrors';
import { PhoneValidator } from '../../../domain/interfaces/validators/PhoneValidator';
import { CodeGenerator } from '../../../domain/interfaces/generators/CodeGenerator';
import { HashGenerator } from '../../../domain/interfaces/generators/HashGenerator';
import { OtpRepository } from '../../../domain/interfaces/repositories/OtpRepository';
import { AuthUser } from '../../../domain/model/User';

describe('requestOtpService', () => {
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

  test('should return a hash and a verification code when the user is correct', () => {
    const nin = 'userNin';
    const phone = 'userPhone';
    const verificationCode = '123456';
    const hash = 'hash';
    const user: AuthUser = { id: 1, nin, isBlocked: false };

    const mockUserRepository = {
      getUser: jest.fn(async () => user),
      isUserPhoneRegistered: jest.fn(async (userId, inputPhone) => {
        return userId === user.id && inputPhone === phone;
      }),
    } as UserRepository;

    const mockOtpRepository = {
      saveOtp: jest.fn(async () => {}),
      getOtp: jest.fn(),
      deleteOtp: jest.fn(),
    } as OtpRepository;

    const mockCodeGenerator = {
      generateSixDigitCode: jest.fn(() => verificationCode),
    } as CodeGenerator;

    const mockHashGenerator = {
      generateHash: jest.fn(() => hash),
    } as HashGenerator;

    const mockPhoneValidator = {
      validatePhone: jest.fn(() => true),
    } as PhoneValidator;

    const serviceResponse = processOtpRequest(
      mockOtpRepository,
      mockUserRepository,
      mockCodeGenerator,
      mockHashGenerator,
      mockPhoneValidator,
      { nin, phone },
    );

    expect(serviceResponse).resolves.toEqual({ hash, verificationCode });
  });

  test('should return a user not found error status message when the user does not exist', () => {
    const nin = 'nonExistingNin';
    const phone = 'nonExistingPhone';
    const mockUserRepository = {
      getUser: jest.fn(async () => null),
      isUserPhoneRegistered: jest.fn(),
    } as UserRepository;

    const serviceResponse = processOtpRequest(
      otpRepository,
      { ...mockUserRepository },
      codeGenerator,
      hashGenerator,
      phoneValidator,
      { nin, phone },
    );

    expect(serviceResponse).resolves.toEqual(userNotFoundErrorStatusMsg);
  });

  test('should return a user blocked error status message when the user is blocked', () => {
    const nin = 'userBlockedNin';
    const phone = 'userBlockedPhone';
    const blockedUser: AuthUser = { id: 1, nin, isBlocked: true };

    const mockUserRepository = {
      getUser: jest.fn(async () => blockedUser),
      isUserPhoneRegistered: jest.fn(),
    } as UserRepository;

    const serviceResponse = processOtpRequest(
      otpRepository,
      { ...mockUserRepository },
      codeGenerator,
      hashGenerator,
      phoneValidator,
      { nin, phone },
    );

    expect(serviceResponse).resolves.toEqual(userBlockedErrorStatusMsg);
  });

  test('should return a user phone unavailable for sms error status message when the user phone is unavailable to be sent an sms', async () => {
    const nin = 'userNin';
    const phone = 'unavailablePhone';
    const user: AuthUser = { id: 1, nin, isBlocked: false };

    const mockUserRepository = {
      getUser: jest.fn(async () => user),
      isUserPhoneRegistered: jest.fn(async () => true),
    } as UserRepository;

    const mockPhoneValidator = {
      validatePhone: jest.fn(() => false),
    } as PhoneValidator;

    const mockOtpRepository = {
      saveOtp: jest.fn(),
      getOtp: jest.fn(),
      deleteOtp: jest.fn(),
    } as OtpRepository;

    const serviceResponse = await processOtpRequest(
      mockOtpRepository,
      mockUserRepository,
      codeGenerator,
      hashGenerator,
      mockPhoneValidator,
      { nin, phone },
    );

    expect(serviceResponse).toEqual(userPhoneUnavailableForSmsErrorStatusMsg);
  });
});
