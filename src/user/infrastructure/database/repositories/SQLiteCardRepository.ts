import db from '@common/infrastructure/database/dbClient';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';
import { Card } from '@src/user/domain/model/Card';
import { UserId } from '@common/domain/model/UserParameters';

export const cardRepository: CardRepository = {
  async addCard(card: Card): Promise<Card | null> {
    const row = { ...card, isPrimary: card.isPrimary ? 1 : 0 };
    await db
      .insertInto('card')
      .values(row as any)
      .execute();
    return card;
  },

  async getCardsByUserId(userId: UserId): Promise<Card[] | null> {
    const cards = await db.selectFrom('card').selectAll().where('userId', '=', userId).execute();

    return cards.length > 0 ? cards : null;
  },
};
