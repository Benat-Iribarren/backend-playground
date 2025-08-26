import { processCardAdderRequest } from '../addCardService';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';
import { TokenGenerator } from '@common/domain/interfaces/generators/TokenGenerator';
import { detectCardBrand } from '@user/domain/helpers/validators/detectCardBrand';

jest.mock('@user/domain/helpers/validators/detectCardBrand', () => ({
  detectCardBrand: jest.fn(),
}));

describe('addCardService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (detectCardBrand as jest.Mock).mockReturnValue('VISA');
  });

  test('should return card info when user exists and card number and expiry is introduced', async () => {
    const cardNumber = '4111111111111111';
    const input = { userId: 1, cardNumber, expiryMonth: 12, expiryYear: 2099, isPrimary: false };
    const repoReturn = {
      id: 99,
      userId: 1,
      lastFourDigits: '1111',
      brand: 'VISA',
      expiryMonth: 12,
      expiryYear: 2099,
      token: 'tok12345',
      isPrimary: false,
    };
    const mockRepo: CardRepository = { addCard: jest.fn().mockResolvedValue(repoReturn as any) };
    const mockTokenGen: TokenGenerator = {
      generateToken: jest.fn().mockReturnValue('tok12345') as any,
    };

    const result = await processCardAdderRequest(mockRepo, mockTokenGen, input);

    expect(mockTokenGen.generateToken).toHaveBeenCalledWith('4111111111111111');
    expect(mockTokenGen.generateToken).toHaveBeenCalledTimes(1);
    expect(mockRepo.addCard).toHaveBeenCalledWith({
      userId: 1,
      lastFourDigits: '1111',
      brand: 'VISA',
      expiryMonth: 12,
      expiryYear: 2099,
      token: 'tok12345',
      isPrimary: false,
    });
    expect(result).toEqual(repoReturn);
  });

  test('should return null when repository returns null', async () => {
    const cardNumber = '4111111111111111';
    const input = { userId: 1, cardNumber, expiryMonth: 12, expiryYear: 2099, isPrimary: false };
    const mockRepo: CardRepository = { addCard: jest.fn().mockResolvedValue(null) };
    const mockTokenGen: TokenGenerator = {
      generateToken: jest.fn().mockReturnValue('tok12345') as any,
    };

    const result = await processCardAdderRequest(mockRepo, mockTokenGen, input);

    expect(mockTokenGen.generateToken).toHaveBeenCalledWith('4111111111111111');
    expect(mockRepo.addCard).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test('should use brand detector and not leak cardNumber to repository payload', async () => {
    (detectCardBrand as jest.Mock).mockReturnValue('VISA');
    const cardNumber = '4111111111111111';
    const input = { userId: 1, cardNumber, expiryMonth: 12, expiryYear: 2099, isPrimary: true };
    const mockRepo: CardRepository = { addCard: jest.fn().mockResolvedValue({} as any) };
    const mockTokenGen: TokenGenerator = {
      generateToken: jest.fn().mockReturnValue('tok12345') as any,
    };

    await processCardAdderRequest(mockRepo, mockTokenGen, input);

    const arg = (mockRepo.addCard as jest.Mock).mock.calls[0][0];
    expect(detectCardBrand).toHaveBeenCalledWith('4111111111111111');
    expect(arg.brand).toBe('VISA');
    expect(arg).not.toHaveProperty('cardNumber');
    expect(arg.isPrimary).toBe(true);
    expect(arg.expiryMonth).toBe(12);
    expect(arg.expiryYear).toBe(2099);
  });

  test('should extract the last four digits of the cardNumber', async () => {
    const cardNumber = '4111111111111111';
    const input = { userId: 1, cardNumber, expiryMonth: 12, expiryYear: 2099, isPrimary: false };
    const mockRepo: CardRepository = { addCard: jest.fn().mockResolvedValue({} as any) };
    const mockTokenGen: TokenGenerator = {
      generateToken: jest.fn().mockReturnValue('tok12345') as any,
    };

    await processCardAdderRequest(mockRepo, mockTokenGen, input);

    const arg = (mockRepo.addCard as jest.Mock).mock.calls[0][0];
    expect(arg.lastFourDigits).toBe('1111');
  });

  test('should propagate repository errors', async () => {
    const cardNumber = '4111111111111111';
    const input = { userId: 1, cardNumber, expiryMonth: 12, expiryYear: 2099, isPrimary: false };
    const mockRepo: CardRepository = { addCard: jest.fn().mockRejectedValue(new Error('db')) };
    const mockTokenGen: TokenGenerator = { generateToken: jest.fn().mockReturnValue('tok') as any };

    await expect(processCardAdderRequest(mockRepo, mockTokenGen, input)).rejects.toThrow('db');
  });

  test('should propagate token generator errors', async () => {
    const input = {
      userId: 1,
      cardNumber: '4111111111111111',
      expiryMonth: 12,
      expiryYear: 2099,
      isPrimary: false,
    };
    const mockRepo: CardRepository = { addCard: jest.fn() as any };
    const mockTokenGen: TokenGenerator = {
      generateToken: jest.fn(() => {
        throw new Error('tok');
      }) as any,
    };

    await expect(processCardAdderRequest(mockRepo, mockTokenGen, input)).rejects.toThrow('tok');
  });
});
