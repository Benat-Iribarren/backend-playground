import { errorSchema } from '../../common/errorSchema';

export const requestOtpSchema = {
  schema: {
    body: {
      type: 'object',
      properties: {
        nin: { type: 'string' },
        phone: { type: 'string' },
      },
      additionalProperties: false,
    },
    response: {
      200: {
        type: 'object',
        properties: {
          hash: { type: 'string' },
          verificationCode: { type: 'string' },
          userId: { type: 'number' },
        },
        required: ['hash', 'verificationCode', 'userId'],
      },
      400: errorSchema,
      403: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
};
