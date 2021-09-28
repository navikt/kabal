import React from 'react';
import { IconProps } from './props';

export const ZoomOutIcon = ({ alt = '' }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>{alt}</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C11.1211 18 13.0709 17.2662 14.6093 16.0386L22.5714 24L24 22.5714L16.0386 14.6093C17.2662 13.0709 18 11.1211 18 9ZM2 9C2 5.13401 5.13401 2 9 2C12.866 2 16 5.13401 16 9C16 12.866 12.866 16 9 16C5.13401 16 2 12.866 2 9ZM14 8H4V10H14V8Z"
      fill="#262626"
    />
  </svg>
);
