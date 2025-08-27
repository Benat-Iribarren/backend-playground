import { processListUserCards } from '../getCardsService';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';

function createMockRepo(): jest.Mocked<CardRepository> {
  return {
    addCard: jest.fn(),
    getCardsByUserId: jest.fn(),
  };
}

describe('getCardsService', () => {
  beforeEach(() => jest.resetAllMocks());

  test('should return user card info list for given an userId with added cards', async () => {
    const userId = 1;
    const repo = createMockRepo();

    repo.getCardsByUserId.mockResolvedValue([
      {
        token: 'tok1',
        lastFourDigits: '1111',
        brand: 'VISA',
        expiry: '12/99',
        isPrimary: true,
      },
      {
        token: 'tok2',
        lastFourDigits: '2222',
        brand: 'MASTERCARD',
        expiry: '01/30',
        isPrimary: false,
      },
    ]);

    const result = await processListUserCards(repo, { userId });

    expect(repo.getCardsByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual([
      { token: 'tok1', lastFourDigits: '1111', brand: 'VISA', expiry: '12/99', isPrimary: true },
      {
        token: 'tok2',
        lastFourDigits: '2222',
        brand: 'MASTERCARD',
        expiry: '01/30',
        isPrimary: false,
      },
    ]);
    expect(result[0]).not.toHaveProperty('id');
    expect(result[0]).not.toHaveProperty('userId');
    expect(result[0]).not.toHaveProperty('cardNumber');
  });

  test('should return empty array when repo returns null', async () => {
    const userId = 1;
    const repo = createMockRepo();
    repo.getCardsByUserId.mockResolvedValue(null);

    const result = await processListUserCards(repo, { userId });

    expect(result).toEqual([]);
  });
});
