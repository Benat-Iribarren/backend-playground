import {
  getProfileService,
  tokenNotFoundErrorStatusMsg,
  userNotFoundErrorStatusMsg,
} from '@user/application/services/getProfileService';
import { TokenReader } from '@auth/domain/interfaces/repositories/TokenReader';
import { UserRepository } from '@user/domain/interfaces/repositories/UserRespository';
import { UserProfile } from '@user/domain/model/UserProfile';

describe('getProfileService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should return the user profile when token exists for a valid user', async () => {
    const token = 'valid-token';
    const userId = 1;
    const profile: UserProfile = {
      id: userId,
      fullName: 'Usuario Uno',
      nin: '87654321Z',
      email: 'user1@example.com',
    };

    const mockTokenReader: TokenReader = {
      getUserIdByToken: jest.fn(async () => userId),
    };

    const mockUserRepository: UserRepository = {
      getUser: jest.fn(),
      isUserPhoneRegistered: jest.fn(),
      getProfile: jest.fn(async () => profile),
    };

    await expect(
      getProfileService(mockTokenReader, mockUserRepository, { token }),
    ).resolves.toEqual(profile);

    expect(mockTokenReader.getUserIdByToken).toHaveBeenCalledWith(token);
    expect(mockUserRepository.getProfile).toHaveBeenCalledWith(userId);
  });

  test('should return a user not found error when token exists but user does not', async () => {
    const token = 'valid-token';
    const userId = -1;

    const mockTokenReader: TokenReader = {
      getUserIdByToken: jest.fn(async () => userId),
    };
    const mockUserRepository: UserRepository = {
      getUser: jest.fn(),
      isUserPhoneRegistered: jest.fn(),
      getProfile: jest.fn(async () => null),
    };
    await expect(
      getProfileService(mockTokenReader, mockUserRepository, { token }),
    ).resolves.toEqual(userNotFoundErrorStatusMsg);

    expect(mockTokenReader.getUserIdByToken).toHaveBeenCalledWith(token);
    expect(mockUserRepository.getProfile).toHaveBeenCalledWith(userId);
  });

  test('should return a token not found error when token does not exist', async () => {
    const token = 'invalid-token';
    const mockTokenReader: TokenReader = {
      getUserIdByToken: jest.fn(async () => null),
    };
    const mockUserRepository: UserRepository = {
      getUser: jest.fn(),
      isUserPhoneRegistered: jest.fn(),
      getProfile: jest.fn(),
    };
    await expect(
      getProfileService(mockTokenReader, mockUserRepository, { token }),
    ).resolves.toEqual(tokenNotFoundErrorStatusMsg);

    expect(mockTokenReader.getUserIdByToken).toHaveBeenCalledWith(token);
    expect(mockUserRepository.getProfile).not.toHaveBeenCalled();
  });
});
