import type { IconProps } from './props';

export const NeutralIcon = ({ alt = '' }: IconProps): React.JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 40 40">
    <title>{alt}</title>

    <path
      fill="#A0A0A0"
      fillRule="evenodd"
      d="M39.959 20.08c0 10.974-8.897 19.871-19.872 19.871S.215 31.054.215 20.08 9.112.207 20.087.207 39.959 9.104 39.959 20.08z"
      clipRule="evenodd"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M18.334 9.11c-1.936-2.574.943-5.453 3.516-3.516 1.936 2.573-.942 5.452-3.516 3.515zm1.325 16.917v-15.67h-1.044c-1.605 0-3.364 0-4.051 2.166-.026.077-2.574 8.153-2.574 8.153-.178.612.153 1.274.765 1.453.56.178 1.12-.102 1.375-.612l1.835-5.987a.529.529 0 01.688-.382c.28.076.407.356.382.611.014 0-.886 2.937-1.732 5.7a957.27 957.27 0 00-1.402 4.593h3.006v7.338a1.37 1.37 0 001.377 1.376 1.37 1.37 0 001.375-1.376V26.026zm.867-15.67h1.502c2.064.128 4.306 1.657 4.306 3.746v7.133c0 .536-.484.969-1.07.969-.586 0-1.07-.433-1.07-.968v-5.555a.456.456 0 00-.459-.458.469.469 0 00-.458.433l-.025.026V33.39a1.377 1.377 0 01-2.752.051V10.358h.026z"
      clipRule="evenodd"
    />
  </svg>
);
