import db from '@common/infrastructure/database/dbClient';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';
import { Card } from '@src/user/domain/model/Card';

export const cardRepository: CardRepository = {
  async addCard(card: Card): Promise<Card | null> {
    const row = {
      userId: Number(card.userId),
      lastFourDigits: String(card.lastFourDigits),
      brand: String(card.brand),
      expiryMonth: Number(card.expiryMonth),
      expiryYear: Number(card.expiryYear),
      token: String(card.token),
      isPrimary: (card.isPrimary ? 1 : 0) as unknown as boolean,
    };

    await db
      .insertInto('card')
      .values(row as any)
      .execute();
    return card;
  },
};
