import { REQUEST_BODY_TYPE, type RequestBodyType } from '@/types/collection';

function getMessageContentType(headers?: Record<string, string>): RequestBodyType {
  console.log(headers);
  if (!headers) return REQUEST_BODY_TYPE.TEXT;

  const contentType = headers['content-type'] ?? headers['Content-Type'] ?? headers['CONTENT-TYPE'];
  console.log(contentType);

  if (!contentType) return REQUEST_BODY_TYPE.TEXT;
  console.log(contentType.includes('application/json') || contentType.includes('+json'));

  if (contentType.includes('application/json') || contentType.includes('+json')) {
    console.log('then you should return kson');
    return REQUEST_BODY_TYPE.JSON;
  }

  return REQUEST_BODY_TYPE.TEXT;
}

export { getMessageContentType };
