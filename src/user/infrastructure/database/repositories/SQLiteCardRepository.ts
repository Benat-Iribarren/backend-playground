import db from '@common/infrastructure/database/dbClient';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';
import { NewCard, Card } from '@src/user/domain/model/Card';

export const cardRepository: CardRepository = {
  async addCard(card: NewCard): Promise<Card | null> {
    const inserted = await db.insertInto('card').values(card).returning(['id']).executeTakeFirst();

    if (!inserted) {
      return null;
    }

    return { ...card, id: inserted.id };
  },
};
