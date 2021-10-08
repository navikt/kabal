import React from 'react';
import { IconProps } from './props';

export const ChevronIcon = ({ alt, className }: IconProps) => (
  <svg className={className} width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>{alt}</title>
    <path
      d="M7.70102 12.2522C8.09966 12.6521 8.09966 13.3003 7.70102 13.7001C7.30239 14.1 6.65607 14.1 6.25743 13.7001L0.298977 7.72394C-0.099659 7.32412 -0.099659 6.67588 0.298977 6.27606L6.25743 0.299867C6.65607 -0.0999556 7.30239 -0.0999556 7.70102 0.299867C8.09966 0.699689 8.09966 1.34793 7.70102 1.74775L2.46436 7L7.70102 12.2522Z"
      fill="#262626"
    />
  </svg>
);
