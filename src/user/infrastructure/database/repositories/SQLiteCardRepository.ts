import db from '@common/infrastructure/database/dbClient';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';
import { Card } from '@src/user/domain/model/Card';
import { UserId } from '@common/domain/model/UserParameters';
import { CardToken } from '@src/user/domain/model/Card';

export const cardRepository: CardRepository = {
  async deleteCardByTokenAndUserId(userId: UserId, token: CardToken): Promise<void> {
    await db
      .deleteFrom('card')
      .where('token', '=', token)
      .where('userId', '=', userId)
      .executeTakeFirst();
  },

  async addCard(card: Card): Promise<Card | null> {
    const row = { ...card, isPrimary: card.isPrimary ? 1 : 0 };
    const existingCard = await db
      .selectFrom('card')
      .select('token')
      .where('token', '=', card.token)
      .executeTakeFirst();

    if (existingCard) {
      await db
        .updateTable('card')
        .set(row as any)
        .where('token', '=', card.token)
        .execute();
    } else {
      await db
        .insertInto('card')
        .values(row as any)
        .execute();
    }
    return card;
  },

  async getCardsByUserId(userId: UserId): Promise<Card[] | null> {
    const cards = await db.selectFrom('card').selectAll().where('userId', '=', userId).execute();

    return cards.length > 0 ? cards : null;
  },
};
