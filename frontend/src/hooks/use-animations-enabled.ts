import { useMemo } from 'react';

export const useAnimationsEnabled = () =>
  useMemo(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
