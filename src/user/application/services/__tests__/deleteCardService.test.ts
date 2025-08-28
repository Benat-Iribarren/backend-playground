import { processDeleteUserCard } from '../deleteCardService';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';
import { detectCardBrand } from '@user/domain/helpers/validators/detectCardBrand';
import { UserId } from '@common/domain/model/UserParameters';

jest.mock('@user/domain/helpers/validators/detectCardBrand', () => ({
  detectCardBrand: jest.fn(),
}));

function createMockRepo(overrides: Partial<CardRepository> = {}): CardRepository {
  return {
    addCard: jest.fn(),
    getCardsByUserId: jest.fn(),
    deleteCardByTokenAndUserId: jest.fn(),
    ...overrides,
  };
}

describe('deleteCardService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (detectCardBrand as jest.Mock).mockReturnValue('VISA');
  });
  const userId: UserId = 1;
  test('should return 201 when valid user token and card token is given', async () => {
    const token = 'valid-token';
    const mockDelete = jest.fn();
    const mockRepo: CardRepository = createMockRepo({
      deleteCardByTokenAndUserId: mockDelete,
    });

    const result = await processDeleteUserCard(mockRepo, { userId, token });

    expect(mockDelete).toHaveBeenCalledWith(userId, token);
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  test('should return repository errors', async () => {
    const token = 'tok-error';
    const mockError = new Error('db failure');
    const mockRepo = createMockRepo({
      deleteCardByTokenAndUserId: jest.fn().mockRejectedValue(mockError),
    });

    await expect(processDeleteUserCard(mockRepo, { userId, token })).rejects.toThrow('db failure');
    expect(mockRepo.deleteCardByTokenAndUserId).toHaveBeenCalledWith(userId, token);
  });
});
