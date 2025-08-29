import { PhoneRepository } from '@user/domain/interfaces/repositories/PhoneRepository';
import { processGetPhones } from '../getPhonesService';
import { UserRepository } from '@user/domain/interfaces/repositories/UserRespository';

function createMockRepo(): jest.Mocked<UserRepository & PhoneRepository> {
  return {
    getUser: jest.fn(),
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    isUserPhoneRegistered: jest.fn(),
    getPhones: jest.fn(),
  };
}

describe('getPhonesService', () => {
  beforeEach(() => jest.resetAllMocks());

  test('should return user phone info list for given an userId with added phones', async () => {
    const userId = 1;
    const repo = createMockRepo();

    repo.getPhones.mockResolvedValue([
      {
        phoneNumber: '1234567890',
        isPrimary: true,
      },
      {
        phoneNumber: '0987654321',
        isPrimary: false,
      },
    ]);

    const result = await processGetPhones(repo, { userId });

    expect(repo.getPhones).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      phones: [
        { phoneNumber: '1234567890', isPrimary: true },
        { phoneNumber: '0987654321', isPrimary: false },
      ],
    });
  });

  test('should return user phone info list for given an userId without added phones', async () => {
    const userId = 1;
    const repo = createMockRepo();

    repo.getPhones.mockResolvedValue(null);

    const result = await processGetPhones(repo, { userId });

    expect(repo.getPhones).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      phones: [],
    });
  });

  test('should return empty array when repo returns null', async () => {
    const userId = 1;
    const repo = createMockRepo();
    repo.getPhones.mockResolvedValue(null);

    const result = await processGetPhones(repo, { userId });

    expect(result).toEqual({ phones: [] });
  });
});
