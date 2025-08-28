import {
  processUpdateProfile,
  successfulStatusMsg,
  userNotFoundErrorStatusMsg,
  emptyPatchErrorStatusMsg,
} from '@src/user/application/services/updateProfileService';
import { UserRepository } from '@src/user/domain/interfaces/repositories/UserRespository';

describe('updateProfileService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should update the user profile when the user exists and data is provided', async () => {
    const userId = 1;
    const data = { fullName: 'Usuario Uno' };

    const mockRepo: UserRepository = {
      getUser: jest.fn(),
      isUserPhoneRegistered: jest.fn(),
      getProfile: jest.fn(),
      updateProfile: jest.fn().mockResolvedValue(true),
      getPhones: jest.fn(),
    };

    const result = await processUpdateProfile(mockRepo, { userId, data });

    expect(result).toBe(successfulStatusMsg);
    expect(mockRepo.updateProfile).toHaveBeenCalledWith(userId, data);
  });

  test('should return user not found when the repository cannot update the user', async () => {
    const userId = 99;
    const data = { email: 'noexiste@example.com' };

    const mockRepo: UserRepository = {
      getUser: jest.fn(),
      isUserPhoneRegistered: jest.fn(),
      getProfile: jest.fn(),
      updateProfile: jest.fn().mockResolvedValue(false),
      getPhones: jest.fn(),
    };

    const result = await processUpdateProfile(mockRepo, { userId, data });

    expect(result).toBe(userNotFoundErrorStatusMsg);
    expect(mockRepo.updateProfile).toHaveBeenCalledWith(userId, data);
  });

  test('should return missing params error for given empty body data', async () => {
    const userId = 1;
    const data = {};

    const mockRepo: UserRepository = {
      getUser: jest.fn(),
      isUserPhoneRegistered: jest.fn(),
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
      getPhones: jest.fn(),
    };

    const result = await processUpdateProfile(mockRepo, { userId, data });

    expect(result).toBe(emptyPatchErrorStatusMsg);
    expect(mockRepo.updateProfile).not.toHaveBeenCalled();
  });
});
