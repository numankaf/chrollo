import * as z from 'zod';

import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';

const REQUEST_VALIDATION_SCHEMA = z.object({
  id: z.string(),
  destination: z.string().min(1, 'Request path is required.'),
  headers: z.array(
    z.object({
      id: z.string(),
      key: z.string(),
      value: z.string(),
      description: z.string().optional(),
      enabled: z.boolean(),
    })
  ),
  body: z.object({
    data: z.string(),
    type: z.enum(Object.values(REQUEST_BODY_TYPE) as [RequestBodyType, ...RequestBodyType[]]),
  }),
  scripts: z.object({
    preRequest: z.string().optional(),
    postResponse: z.string().optional(),
  }),
  documentation: z.string().optional(),
});

export { REQUEST_VALIDATION_SCHEMA };
