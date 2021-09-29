import React from 'react';
import { IconProps } from './props';

export const SuccessIcon = ({ alt = '' }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
    <title>{alt}</title>

    <path stroke="#6A6A6A" d="M9 1C4.589 1 1 4.59 1 9s3.589 8 8 8c4.41 0 8-3.59 8-8s-3.59-8-8-8z"></path>
    <path
      fill="#6A6A6A"
      d="M7.426 10.628l4.307-3.893a.665.665 0 01.918.03.615.615 0 01-.031.889l-4.766 4.308a.662.662 0 01-.902-.015l-1.588-1.539a.615.615 0 010-.889.664.664 0 01.918 0l1.144 1.109z"
    ></path>
  </svg>
);
