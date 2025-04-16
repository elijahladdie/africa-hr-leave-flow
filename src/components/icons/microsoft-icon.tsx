
import { SVGProps } from "react";

export function MicrosoftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11.4 3H3v8.4h8.4V3z" fill="#F35325" />
      <path d="M21 3h-8.4v8.4H21V3z" fill="#81BC06" />
      <path d="M11.4 12.6H3V21h8.4v-8.4z" fill="#05A6F0" />
      <path d="M21 12.6h-8.4V21H21v-8.4z" fill="#FFBA08" />
    </svg>
  );
}
