import { errorSchema } from '@common/infrastructure/endpoints/errorSchema';

export const getProfileSchema = {
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
          id: { type: 'number' },
          fullName: { type: 'string' },
          nin: { type: 'string' },
          email: { type: 'string' },
        },
        required: ['id', 'fullName', 'nin', 'email'],
      },
      400: errorSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
};
