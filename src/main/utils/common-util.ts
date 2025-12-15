export function stripAllWhitespace(input: string): string {
  return input.replace(/[\s\u200B-\u200D\uFEFF]+/g, '');
}
