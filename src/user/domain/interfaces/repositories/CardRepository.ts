import { UserId } from '@common/domain/model/UserParameters';
import { Card, CardToken } from '@src/user/domain/model/Card';
export interface CardRepository {
  deleteCardByTokenAndUserId(userId: UserId, token: CardToken): Promise<void>;
  addCard(card: Card): Promise<Card | null>;
  getCardsByUserId(userId: UserId): Promise<Card[] | null>;
}
