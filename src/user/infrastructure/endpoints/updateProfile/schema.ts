import { errorSchema } from '@common/infrastructure/endpoints/errorSchema';

export const updateProfileSchema = {
  schema: {
    headers: {
      type: 'object',
      properties: {
        authorization: { type: 'string', description: 'Bearer token' },
      },
      required: ['authorization'],
    },
    body: {
      type: 'object',
      properties: {
        fullName: { type: 'string', maxLength: 100 },
        nin: { type: 'string' },
        email: { type: 'string', maxLength: 100 },
      },
      additionalProperties: false,
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
        required: ['message'],
      },
      400: errorSchema,
      401: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
};
