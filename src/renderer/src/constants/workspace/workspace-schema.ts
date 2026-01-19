import * as z from 'zod';

import { WORKSPACE_TYPE, type WorkspaceType } from '@/types/workspace';

export const WORKSPACE_VALIDATION_SCHEMA = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable(),
  type: z.enum(Object.values(WORKSPACE_TYPE) as [WorkspaceType, ...WorkspaceType[]]),
  modelType: z.literal('WORKSPACE'),
});
