import { Card } from '@src/user/domain/model/Card';

export interface CardRepository {
  addCard(card: Card): Promise<Card | null>;
}
