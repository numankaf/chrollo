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

export const ENVIRONMENT_KEY_REGEX = /^[a-zA-Z_][\w.-]*$/;
export const ENVIRONMENT_VAR_REGEX = /\{\{\s*[a-zA-Z_][\w.-]*\s*}}/g;
export const ENVIRONMENT_VAR_CAPTURE_REGEX = /^\{\{\s*([a-zA-Z_][\w.-]*)\s*}}$/;
