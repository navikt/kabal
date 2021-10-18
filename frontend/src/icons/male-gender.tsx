import React from 'react';
import { IconProps } from './props';

export const MaleGenderIcon = ({ alt = '' }: IconProps): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 40 40">
    <title>{alt}</title>

    <path
      fill="#3386E0"
      fillRule="evenodd"
      d="M20 0C8.955 0 0 8.955 0 20s8.954 20 20 20 20-8.954 20-20C40 8.955 31.045 0 20 0z"
      clipRule="evenodd"
    ></path>
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M22.422 7.39a2.422 2.422 0 10-4.845.002 2.422 2.422 0 004.845-.002zm3.886 14.066v-6.75l.001-.436c0-2.117-2.256-3.66-4.343-3.776l-1.505-.01v-.005l-.46.003-.46-.003v.005l-1.505.01c-2.089.117-4.344 1.66-4.344 3.776v7.186c0 .544.484.983 1.084.983.599 0 1.085-.44 1.085-.984v-5.594a.457.457 0 01.914-.031c0 .005.003.009.006.013a.035.035 0 01.007.019v17.792a1.378 1.378 0 102.756 0V22.375a.456.456 0 01.912 0V33.655a1.38 1.38 0 002.756 0V15.861c0-.007.004-.012.007-.018a.051.051 0 00.007-.014.457.457 0 01.913.032V21.456c0 .544.486.984 1.085.984.6 0 1.084-.44 1.084-.984z"
      clipRule="evenodd"
    ></path>
  </svg>
);
