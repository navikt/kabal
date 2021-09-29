import React from 'react';
import { IconProps } from './props';

export const CopyIcon = ({ alt = '' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <title>{alt}</title>

    <path
      fill="#3E3832"
      fillRule="evenodd"
      d="M20.961 6.308a.495.495 0 00-.108-.162L14.854.147A.495.495 0 0014.5 0h-8a.5.5 0 00-.5.5V3H3.5a.5.5 0 00-.5.5v20a.5.5 0 00.5.5h14a.5.5 0 00.5-.5V21h2.5a.5.5 0 00.5-.5v-14a.499.499 0 00-.039-.192zM15 1.707L19.293 6H15V1.707zM17 23H4V4h2v16.5a.5.5 0 00.5.5H17v2zM7 20V1h7v5.5a.5.5 0 00.5.5H20v13H7z"
      clipRule="evenodd"
    ></path>
  </svg>
);
