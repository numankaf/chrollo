import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';

function getMessageContentType(headers?: Record<string, string>): RequestBodyType {
  if (!headers) return REQUEST_BODY_TYPE.TEXT;

  const contentType = headers['content-type'] ?? headers['Content-Type'] ?? headers['CONTENT-TYPE'];

  if (!contentType) return REQUEST_BODY_TYPE.TEXT;

  if (contentType.includes('application/json') || contentType.includes('+json')) {
    return REQUEST_BODY_TYPE.JSON;
  }

  return REQUEST_BODY_TYPE.TEXT;
}

export { getMessageContentType };
