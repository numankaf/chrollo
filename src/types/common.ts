export interface Header {
  value: string;
  description: string;
  enabled: boolean;
}

export interface Scripts {
  preScript: string;
  postScript: string;
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}
