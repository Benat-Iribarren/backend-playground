import { UserId } from '@common/domain/model/UserParameters';
import { Card } from '@user/domain/model/Card';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';

type GetCardsInput = { userId: UserId };

export async function getCardsService(
  cardRepository: CardRepository,
  { userId }: GetCardsInput,
): Promise<Card[]> {
  const cards = await cardRepository.getCardsByUserId(userId);
  return cards ?? [];
}
