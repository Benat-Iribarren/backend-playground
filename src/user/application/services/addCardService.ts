import { UserId } from '@common/domain/model/UserParameters';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';
import { TokenGenerator } from '@common/domain/interfaces/generators/TokenGenerator';
import {
  Brand,
  Card,
  CardToken,
  ExpiryMonth,
  CardNumber,
  ExpiryYear,
  IsPrimary,
  LastFourDigits,
} from '@user/domain/model/Card';
import { detectCardBrand } from '@user/domain/helpers/validators/detectCardBrand';

type addCardInput = {
  userId: UserId;
  cardNumber: CardNumber;
  expiryMonth: ExpiryMonth;
  expiryYear: ExpiryYear;
  isPrimary: IsPrimary;
};

export async function processAddCard(
  cardRepository: CardRepository,
  tokenGenerator: TokenGenerator,
  input: addCardInput,
): Promise<Card | null> {
  const token: CardToken = tokenGenerator.generateToken(input.cardNumber);
  const lastFourDigits: LastFourDigits = input.cardNumber.slice(-4);
  const brand: Brand = detectCardBrand(input.cardNumber);
  const card: Card = {
    userId: input.userId,
    lastFourDigits,
    brand,
    expiryMonth: input.expiryMonth,
    expiryYear: input.expiryYear,
    token,
    isPrimary: input.isPrimary,
  };
  const inserted = await cardRepository.addCard(card);
  return inserted;
}
