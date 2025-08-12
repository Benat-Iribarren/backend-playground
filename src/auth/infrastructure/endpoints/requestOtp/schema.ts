import { errorSchema } from '../common/errorSchema';

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
      201: {
        type: 'object',
        properties: {
          hash: { type: 'string' },
          verificationCode: { type: 'string' },
        },
        required: ['hash', 'verificationCode'],
      },
      400: errorSchema,
      401: errorSchema,
      403: errorSchema,
      500: errorSchema,
    },
  },
};
