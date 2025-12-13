import { REQUEST_BODY_TYPE } from '@/types/collection';

function isJsonContentType(headers?: Record<string, string>): boolean {
  if (!headers) return false;

  const contentType = headers['content-type'] ?? headers['Content-Type'] ?? headers['CONTENT-TYPE'];

  if (!contentType) return false;

  return contentType.includes('application/json') || contentType.includes('+json');
}

export const CONTENT_TYPE_MAP = {
  [REQUEST_BODY_TYPE.TEXT]: 'text/plain;charset=UTF-8',
  [REQUEST_BODY_TYPE.JSON]: 'application/json',
} as const;

export { isJsonContentType };
