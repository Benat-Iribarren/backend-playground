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
import { UserWithId } from '../../../domain/model/User';
import { PhoneValidator } from '../../../domain/interfaces/validators/PhoneValidator';

/**
 * @group unitary
 */
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

  test('should return a user not found error status message when the user does not exist', () => {
    const nin = 'nonExistingNin';
    const phone = 'nonExistingPhone';
    const mockUserRepository = {
      getUser: jest.fn(async () => null),
    } as UserRepository;

    const serviceResponse = processOtpRequest(
      otpRepository,
      { ...mockUserRepository },
      codeGenerator,
      hashGenerator,
      phoneValidator,
      nin,
      phone,
    );

    expect(serviceResponse).resolves.toEqual(userNotFoundErrorStatusMsg);
  });

  test('should return a user blocked error status message when the user is blocked', () => {
    const nin = 'userBlockedNin';
    const phone = 'userBlockedPhone';
    const blockedUser: UserWithId = { id: 1, nin, phone, isBlocked: true };

    const mockUserRepository = {
      getUser: jest.fn(async () => blockedUser),
    } as UserRepository;

    const serviceResponse = processOtpRequest(
      otpRepository,
      { ...mockUserRepository },
      codeGenerator,
      hashGenerator,
      phoneValidator,
      nin,
      phone,
    );

    expect(serviceResponse).resolves.toEqual(userBlockedErrorStatusMsg);
  });

  test('should return a user phone unavailable for sms error status message when the user phone is unavailable to be sent an sms', () => {
    const nin = 'userNin';
    const phone = 'unavailablePhone';
    const userWithUnavailablePhone: UserWithId = { id: 1, nin, phone, isBlocked: false };

    const mockUserRepository = {
      getUser: jest.fn(async () => userWithUnavailablePhone),
    } as UserRepository;

    const mockPhoneValidator = {
      validatePhone: jest.fn(() => false),
    } as PhoneValidator;

    const serviceResponse = processOtpRequest(
      otpRepository,
      { ...mockUserRepository },
      codeGenerator,
      hashGenerator,
      { ...mockPhoneValidator },
      nin,
      phone,
    );

    expect(serviceResponse).resolves.toEqual(userPhoneUnavailableForSmsErrorStatusMsg);
  });
});
