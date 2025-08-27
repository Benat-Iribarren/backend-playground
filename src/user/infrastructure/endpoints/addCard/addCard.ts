import { FastifyInstance } from 'fastify';
import { addCardSchema } from './schema';
import { CardRepository } from '@user/domain/interfaces/repositories/CardRepository';
import { TokenGenerator } from '@common/domain/interfaces/generators/TokenGenerator';
import { processAddCard } from '@user/application/services/addCardService';
import { isValidCardNumber } from '@user/domain/helpers/validators/cardNumberValidator';
import {
  AddCardErrors,
  invalidCardOrExpiryErrorStatusMsg,
  missingCardOrExpiryErrorStatusMsg,
  persistenceErrorStatusMsg,
  unauthorizedErrorStatusMsg,
} from './errors';

export const ADD_CARD_ENDPOINT = '/user/card';

type AddCardBody = { cardNumber: string; expiry: string };

type AddCardSuccessBody = {
  message: string;
  card: {
    token: string;
    lastFourDigits: string;
    brand: string;
    expiry: string;
    isPrimary: boolean;
  };
};

type StatusCode = 201 | 400 | 401 | 500;

const statusToMessage: { [K in AddCardErrors]: { error: string } } & {
  [key: string]: { error: string };
} = {
  [missingCardOrExpiryErrorStatusMsg]: { error: 'Missing card number or expiry date.' },
  [invalidCardOrExpiryErrorStatusMsg]: { error: 'Invalid card number or expiry date.' },
  [unauthorizedErrorStatusMsg]: { error: 'Unauthorized.' },
  [persistenceErrorStatusMsg]: { error: 'Internal Server Error' },
};

const statusToCode: { [K in AddCardErrors]: StatusCode } & { [key: string]: StatusCode } = {
  SUCCESSFUL: 201,
  [missingCardOrExpiryErrorStatusMsg]: 400,
  [invalidCardOrExpiryErrorStatusMsg]: 400,
  [unauthorizedErrorStatusMsg]: 401,
  [persistenceErrorStatusMsg]: 500,
};

interface AddCardDependencies {
  cardRepository: CardRepository;
  tokenGenerator: TokenGenerator;
}

function addCard(deps: AddCardDependencies) {
  return async function (fastify: FastifyInstance) {
    fastify.post(ADD_CARD_ENDPOINT, addCardSchema, async (request, reply) => {
      try {
        const userId = request.userId;
        if (!userId) {
          return reply
            .status(statusToCode[unauthorizedErrorStatusMsg])
            .send(statusToMessage[unauthorizedErrorStatusMsg]);
        }

        const { cardNumber, expiry } = request.body as AddCardBody;
        if (missingParameters(cardNumber, expiry)) {
          return reply
            .status(statusToCode[missingCardOrExpiryErrorStatusMsg])
            .send(statusToMessage[missingCardOrExpiryErrorStatusMsg]);
        }

        if (invalidParameters(cardNumber, expiry)) {
          return reply
            .status(statusToCode[invalidCardOrExpiryErrorStatusMsg])
            .send(statusToMessage[invalidCardOrExpiryErrorStatusMsg]);
        }

        const [mm, yy] = expiry.split('/');
        const expiryMonth = Number(mm);
        const expiryYear = extractExpiryYear(yy);

        const result = await processAddCard(deps.cardRepository, deps.tokenGenerator, {
          userId,
          cardNumber,
          expiryMonth,
          expiryYear,
          isPrimary: false,
        });

        if (!result) {
          return reply
            .status(statusToCode[persistenceErrorStatusMsg])
            .send(statusToMessage[persistenceErrorStatusMsg]);
        }

        const body: AddCardSuccessBody = {
          message: 'Card added successfully.',
          card: {
            token: result.token,
            lastFourDigits: result.lastFourDigits,
            brand: result.brand,
            expiry,
            isPrimary: result.isPrimary,
          },
        };

        return reply.status(statusToCode.SUCCESSFUL).send(body);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    });
  };
}

function missingParameters(cardNumber: string, expiry: string) {
  return !cardNumber || !expiry;
}

function invalidParameters(cardNumber: string, expiry: string) {
  return !isValidCardNumber(cardNumber) || invalidExpiry(expiry);
}

function invalidExpiry(expiry: string): boolean {
  const date = /^(\d{2})\/(\d{2}|\d{4})$/.exec(expiry);
  if (!date) {
    return true;
  }
  const month = Number(date[1]);
  const year = Number(date[2].length === 2 ? `20${date[2]}` : date[2]);
  if (Number.isNaN(month) || Number.isNaN(year)) {
    return true;
  }
  if (month < 1 || month > 12) {
    return true;
  }
  return false;
}

function extractExpiryYear(yy: string) {
  return Number(yy.length === 2 ? `20${yy}` : yy);
}
export default addCard;
