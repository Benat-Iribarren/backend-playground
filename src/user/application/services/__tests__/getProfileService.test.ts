import {
  processProfileGet,
  userNotFoundErrorStatusMsg,
} from '@user/application/services/getProfileService';
import { UserRepository } from '@user/domain/interfaces/repositories/UserRespository';
import { UserProfile } from '@user/domain/model/UserProfile';

describe('getProfileService', () => {
  beforeEach(() => jest.resetAllMocks());

  test('should return the user profile when user exists', async () => {
    const userId = 1;
    const profile: UserProfile = {
      id: userId,
      fullName: 'Usuario Uno',
      nin: '87654321Z',
      email: 'user1@example.com',
    };

    const mockRepo: UserRepository = {
      getUser: jest.fn(),
      isUserPhoneRegistered: jest.fn(),
      getProfile: jest.fn(async () => profile),
      updateProfile: jest.fn(),
    };

    await expect(processProfileGet(mockRepo, { userId })).resolves.toEqual(profile);
    expect(mockRepo.getProfile).toHaveBeenCalledWith(userId);
  });

  test('should return user not found error when repo returns null', async () => {
    const userId = 99;

    const mockRepo: UserRepository = {
      getUser: jest.fn(),
      isUserPhoneRegistered: jest.fn(),
      getProfile: jest.fn(async () => null),
      updateProfile: jest.fn(),
    };

    await expect(processProfileGet(mockRepo, { userId })).resolves.toBe(userNotFoundErrorStatusMsg);
    expect(mockRepo.getProfile).toHaveBeenCalledWith(userId);
  });
});
