import { UserId } from '@common/domain/model/UserParameters';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';

type DeleteCardInput = { userId: UserId; token: string };

export async function processDeleteUserCard(
  cardRepository: CardRepository,
  { userId, token }: DeleteCardInput,
): Promise<void> {
  await cardRepository.deleteCardByTokenAndUserId(userId, token);
}
