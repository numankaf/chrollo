import * as z from 'zod';

import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';
import { CONNECTION_TYPE, type ConnectionType } from '@/types/connection';

const BASE_REQUEST_SCHEMA = {
  id: z.string(),
  workspaceId: z.string(),
  destination: z.string(),
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
};

function getRequestValidationSchema(connectionType?: ConnectionType) {
  return z.object({
    ...BASE_REQUEST_SCHEMA,
    destination: connectionType === CONNECTION_TYPE.STOMP ? z.string().min(1, 'Destination is required.') : z.string(),
  });
}

// Default schema for type inference
const REQUEST_VALIDATION_SCHEMA = getRequestValidationSchema();

export { REQUEST_VALIDATION_SCHEMA, getRequestValidationSchema };
