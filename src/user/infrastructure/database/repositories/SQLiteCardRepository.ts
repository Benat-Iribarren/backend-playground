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
    try {
      if (!card.userId || !card.expiryMonth || !card.expiryYear) {
        throw new Error('Missing required card fields: userId, expiryMonth, expiryYear');
      }

      const existingCard = await db
        .selectFrom('card')
        .select('token')
        .where('token', '=', card.token)
        .executeTakeFirst();

      const dbCard = {
        userId: card.userId,
        lastFourDigits: card.lastFourDigits,
        brand: card.brand,
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        token: card.token,
        isPrimary: card.isPrimary,
      };

      if (existingCard) {
        await db.updateTable('card').set(dbCard).where('token', '=', card.token).execute();
      } else {
        await db.insertInto('card').values(dbCard).execute();
      }
      return card;
    } catch (error) {
      // Log error for debugging - will remove after fixing
      // eslint-disable-next-line no-console
      console.error('SQLiteCardRepository.addCard error:', error);
      throw error;
    }
  },

  async getCardsByUserId(userId: UserId): Promise<Card[] | null> {
    const cards = await db.selectFrom('card').selectAll().where('userId', '=', userId).execute();

    return cards.length > 0 ? cards : null;
  },
};
