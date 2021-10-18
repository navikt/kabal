import React from 'react';
import { IconProps } from './props';

interface CancelIconProps extends IconProps {
  fill?: string;
}

export const CancelIcon = ({ alt = '', fill = 'black', className }: CancelIconProps) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <title>{alt}</title>
    <path
      d="M1.56445 0L6.0032 4.43894L10.4357 0.00690512L12 1.57137L7.56753 6.00329L11.9929 10.4288L10.4287 11.9931L6.0032 7.56764L1.57135 12L0.00708672 10.4359L4.43888 6.00329L0 1.56428L1.56445 0Z"
      fill={fill}
    />
  </svg>
);
