import { keyframes } from 'styled-components';

export const SLIDE_DURATION = 150;

export const SLIDE_OUT_KEYFRAMES: Keyframe[] = [
  { transform: 'translateX(0%)' },
  { transform: 'translateX(calc(100% + 8px))' },
];

export const SLIDE_OUT_OPTIONS: KeyframeAnimationOptions = {
  duration: SLIDE_DURATION,
  easing: 'ease-in-out',
  fill: 'forwards',
};

export const SCALE_X = keyframes`
  from {
    transform: scaleX(100%);
  }

  to {
    transform: scaleX(0%);
  }
`;

export const SLIDE_IN = keyframes`
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0%);
  }
`;
