import { UserId } from '@common/domain/model/UserParameters';
import { Card } from '@src/user/domain/model/Card';
export interface CardRepository {
  addCard(card: Card): Promise<Card | null>;
  getCardsByUserId(userId: UserId): Promise<Card[] | null>;
}
