function isJsonContentType(headers?: Record<string, string>): boolean {
  if (!headers) return false;

  const contentType = headers['content-type'] ?? headers['Content-Type'] ?? headers['CONTENT-TYPE'];

  if (!contentType) return false;

  return contentType.includes('application/json') || contentType.includes('+json');
}

export { isJsonContentType };
