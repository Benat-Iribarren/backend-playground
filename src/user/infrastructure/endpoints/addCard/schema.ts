import { errorSchema } from '@common/infrastructure/endpoints/errorSchema';

export const addCardSchema = {
  schema: {
    headers: {
      type: 'object',
      properties: { authorization: { type: 'string' } },
      required: ['authorization'],
    },
    body: {
      type: 'object',
      properties: {
        cardNumber: { type: 'string' },
        expiry: { type: 'string' },
      },
      required: ['cardNumber', 'expiry'],
      additionalProperties: false,
    },
    response: {
      201: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          card: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              lastFourDigits: { type: 'string' },
              brand: { type: 'string' },
              expiry: { type: 'string' },
              isPrimary: { type: 'boolean' },
            },
            required: ['token', 'lastFourDigits', 'brand', 'expiry', 'isPrimary'],
          },
        },
        required: ['message', 'card'],
      },
      400: errorSchema,
      401: errorSchema,
      500: errorSchema,
    },
  },
};
