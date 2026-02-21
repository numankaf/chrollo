export interface Header {
  id: string;
  key: string;
  value: string;
  description?: string;
  enabled: boolean;
}

export interface Scripts {
  preRequest?: string;
  postResponse?: string;
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

// Plain environment variable KEY (no {{ }})
// Use for: inputs, validation, forms
export const ENVIRONMENT_KEY_REGEX = /^[a-zA-Z_][\w.-]*$/;

// Match ALL environment variable placeholders in text
// Use for: replace, split, MatchDecorator
export const ENVIRONMENT_VARIABLE_MATCH_REGEX = /\{\{\s*[a-zA-Z_][\w.-]*\s*}}/g;

// Match EXACTLY ONE placeholder and CAPTURE the key
// Use for: hover, tooltip, single-token parsing
export const ENVIRONMENT_VARIABLE_CAPTURE_REGEX = /^\{\{\s*([a-zA-Z_][\w.-]*)\s*}}$/;

export const VARIABLE_SOURCE = {
  GLOBAL: 'global',
  ENVIRONMENT: 'environment',
  SCRIPT: 'script',
} as const;

export type VariableSource = (typeof VARIABLE_SOURCE)[keyof typeof VARIABLE_SOURCE];
