import { processOtpRequest } from '../requestOtpService';
import { UserRepository } from '@user/domain/interfaces/repositories/UserRespository';
import {
  userBlockedErrorStatusMsg,
  userNotFoundErrorStatusMsg,
  userPhoneUnavailableForSmsErrorStatusMsg,
} from '../../../domain/errors/userLoginErrors';
import { PhoneValidator } from '../../../domain/interfaces/validators/PhoneValidator';
import { CodeGenerator } from '../../../domain/interfaces/generators/CodeGenerator';
import { HashGenerator } from '../../../domain/interfaces/generators/HashGenerator';
import { OtpRepository } from '../../../domain/interfaces/repositories/OtpRepository';
import { UserAuth } from '../../../domain/model/UserAuth';
import { PhoneRepository } from '@user/domain/interfaces/repositories/PhoneRepository';

describe('requestOtpService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should return a hash and a verification code when the user is correct', async () => {
    const nin = 'userNin';
    const phone = 'userPhone';
    const verificationCode = '123456';
    const hash = 'hash';
    const user: UserAuth = { id: 1, nin, isBlocked: false };

    const mockUserRepository: UserRepository = {
      getUser: jest.fn(async () => user),
      updateProfile: jest.fn(),
      getProfile: jest.fn(),
    };

    const mockPhoneRepository: PhoneRepository = {
      isUserPhoneRegistered: jest.fn(async (userId, inputPhone) => {
        return userId === user.id && inputPhone === phone;
      }),
      getPhones: jest.fn(),
    };

    const mockOtpRepository: OtpRepository = {
      saveOtp: jest.fn(async () => {}),
      getOtp: jest.fn(),
      deleteOtp: jest.fn(),
    };

    const mockCodeGenerator: CodeGenerator = {
      generateSixDigitCode: jest.fn(() => verificationCode),
    };

    const mockHashGenerator: HashGenerator = {
      generateHash: jest.fn(() => hash),
    };

    const mockPhoneValidator: PhoneValidator = {
      validatePhone: jest.fn(() => true),
    };

    await expect(
      processOtpRequest(
        mockOtpRepository,
        mockUserRepository,
        mockCodeGenerator,
        mockHashGenerator,
        mockPhoneRepository,
        mockPhoneValidator,
        { nin, phone },
      ),
    ).resolves.toEqual({ hash, verificationCode });

    expect(mockOtpRepository.saveOtp).toHaveBeenCalledTimes(1);
  });

  test('should return a user not found error status message when the user does not exist', async () => {
    const nin = 'nonExistingNin';
    const phone = 'nonExistingPhone';

    const mockUserRepository: UserRepository = {
      getUser: jest.fn(async () => null),
      updateProfile: jest.fn(),
      getProfile: jest.fn(),
    };

    const mockPhoneRepository: PhoneRepository = {
      isUserPhoneRegistered: jest.fn(),
      getPhones: jest.fn(),
    };

    const mockOtpRepository: OtpRepository = {
      saveOtp: jest.fn(),
      getOtp: jest.fn(),
      deleteOtp: jest.fn(),
    };

    const mockCodeGenerator: CodeGenerator = { generateSixDigitCode: jest.fn() };
    const mockHashGenerator: HashGenerator = { generateHash: jest.fn() };
    const mockPhoneValidator: PhoneValidator = { validatePhone: jest.fn() };

    await expect(
      processOtpRequest(
        mockOtpRepository,
        mockUserRepository,
        mockCodeGenerator,
        mockHashGenerator,
        mockPhoneRepository,
        mockPhoneValidator,
        { nin, phone },
      ),
    ).resolves.toEqual(userNotFoundErrorStatusMsg);
  });

  test('should return a user blocked error status message when the user is blocked', async () => {
    const nin = 'userBlockedNin';
    const phone = 'userBlockedPhone';
    const blockedUser: UserAuth = { id: 1, nin, isBlocked: true };

    const mockUserRepository: UserRepository = {
      getUser: jest.fn(async () => blockedUser),
      updateProfile: jest.fn(),
      getProfile: jest.fn(),
    };

    const mockPhoneRepository: PhoneRepository = {
      isUserPhoneRegistered: jest.fn(),
      getPhones: jest.fn(),
    };

    const mockOtpRepository: OtpRepository = {
      saveOtp: jest.fn(),
      getOtp: jest.fn(),
      deleteOtp: jest.fn(),
    };

    const mockCodeGenerator: CodeGenerator = { generateSixDigitCode: jest.fn() };
    const mockHashGenerator: HashGenerator = { generateHash: jest.fn() };
    const mockPhoneValidator: PhoneValidator = { validatePhone: jest.fn() };

    await expect(
      processOtpRequest(
        mockOtpRepository,
        mockUserRepository,
        mockCodeGenerator,
        mockHashGenerator,
        mockPhoneRepository,
        mockPhoneValidator,
        { nin, phone },
      ),
    ).resolves.toEqual(userBlockedErrorStatusMsg);
  });

  test('should return a user phone unavailable for sms error status message when the user phone is unavailable to be sent an sms', async () => {
    const nin = 'userNin';
    const phone = 'unavailablePhone';
    const user: UserAuth = { id: 1, nin, isBlocked: false };

    const mockUserRepository: UserRepository = {
      getUser: jest.fn(async () => user),
      updateProfile: jest.fn(),
      getProfile: jest.fn(),
    };

    const mockPhoneRepository: PhoneRepository = {
      isUserPhoneRegistered: jest.fn(async () => true),
      getPhones: jest.fn(),
    };

    const mockPhoneValidator: PhoneValidator = {
      validatePhone: jest.fn(() => false),
    };

    const mockOtpRepository: OtpRepository = {
      saveOtp: jest.fn(),
      getOtp: jest.fn(),
      deleteOtp: jest.fn(),
    };

    const mockCodeGenerator: CodeGenerator = { generateSixDigitCode: jest.fn() };
    const mockHashGenerator: HashGenerator = { generateHash: jest.fn() };

    const serviceResponse = await processOtpRequest(
      mockOtpRepository,
      mockUserRepository,
      mockCodeGenerator,
      mockHashGenerator,
      mockPhoneRepository,
      mockPhoneValidator,
      { nin, phone },
    );

    expect(serviceResponse).toEqual(userPhoneUnavailableForSmsErrorStatusMsg);
  });
});
