import { FastifyInstance } from 'fastify';
import { processListUserCards } from '@user/application/services/getCardsService';
import { cardRepository as defaultCardRepository } from '@user/infrastructure/database/repositories/SQLiteCardRepository';
import { getCardsSchema } from './schema';

export const GET_CARDS_ENDPOINT = '/user/cards' as const;

type Deps = { cardRepository: typeof defaultCardRepository };

export default function registerGetCards(deps: Deps = { cardRepository: defaultCardRepository }) {
  return async function (fastify: FastifyInstance) {
    fastify.get(GET_CARDS_ENDPOINT, getCardsSchema, async (request, reply) => {
      try {
        const userId = request.userId!;
        const cards = await processListUserCards(deps.cardRepository, { userId });
        const body = {
          cards: cards.map((card) => ({
            token: card.token,
            lastFourDigits: card.lastFourDigits,
            brand: card.brand,
            expiry: unifyExpiryMonthWithYear(card.expiryMonth!, card.expiryYear!),
            isPrimary: card.isPrimary,
          })),
        };
        return reply.status(200).send(body);
      } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    });
  };
}
const unifyExpiryMonthWithYear = (month: number, year: number) =>
  `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
