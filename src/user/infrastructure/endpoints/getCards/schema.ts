import { errorSchema } from '@common/infrastructure/endpoints/errorSchema';

export const getCardsSchema = {
  schema: {
    headers: {
      type: 'object',
      properties: {
        authorization: {
          type: 'string',
          description: 'Bearer token',
        },
      },
      required: ['authorization'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          cards: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                lastFourDigits: { type: 'string' },
                brand: { type: 'string' },
                expiry: { type: 'string' },
                isPrimary: { type: 'boolean' },
              },
              required: ['token', 'lastFourDigits', 'brand', 'expiry', 'isPrimary'],
              additionalProperties: false,
            },
          },
        },
        required: ['cards'],
        additionalProperties: false,
      },
      400: errorSchema,
      401: errorSchema,
      500: errorSchema,
    },
  },
};
