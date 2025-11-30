export interface Header {
  id: string;
  key: string;
  value: string;
  description: string;
  enabled: boolean;
}

export interface Scripts {
  preRequest: string;
  postRequest: string;
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
