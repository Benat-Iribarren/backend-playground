import { processDeleteUserCard } from '../deleteCardService';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';
import { UserId } from '@common/domain/model/UserParameters';

function createMockRepo(overrides: Partial<CardRepository> = {}): CardRepository {
  return {
    addCard: jest.fn(),
    getCardsByUserId: jest.fn(),
    deleteCardByTokenAndUserId: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('deleteCardService', () => {
  beforeEach(() => jest.resetAllMocks());

  const userId: UserId = 1;

  test('should call repository with userId and token and resolve', async () => {
    const token = 'valid-token';
    const mockRepo = createMockRepo();

    const result = await processDeleteUserCard(mockRepo, { userId, token });

    expect(mockRepo.deleteCardByTokenAndUserId).toHaveBeenCalledWith(userId, token);
    expect(mockRepo.deleteCardByTokenAndUserId).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  test('should propagate repository errors', async () => {
    const token = 'tok-error';
    const mockError = new Error('db failure');
    const mockRepo = createMockRepo({
      deleteCardByTokenAndUserId: jest.fn().mockRejectedValue(mockError),
    });

    await expect(processDeleteUserCard(mockRepo, { userId, token })).rejects.toThrow('db failure');
    expect(mockRepo.deleteCardByTokenAndUserId).toHaveBeenCalledWith(userId, token);
  });
});
