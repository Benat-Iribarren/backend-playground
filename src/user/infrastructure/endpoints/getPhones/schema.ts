import { errorSchema } from '@common/infrastructure/endpoints/errorSchema';

export const getPhonesSchema = {
  schema: {
    headers: {
      type: 'object',
      properties: {
        authorization: { type: 'string', description: 'Bearer token' },
      },
      required: ['authorization'],
      additionalProperties: false,
    },
    response: {
      200: {
        type: 'object',
        properties: {
          phones: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                phoneNumber: { type: 'string' },
                isPrimary: { type: 'boolean' },
              },
              required: ['phoneNumber', 'isPrimary'],
              additionalProperties: false,
            },
          },
        },
        required: ['phones'],
        additionalProperties: false,
      },
      401: errorSchema,
      500: errorSchema,
    },
  },
};
