import { useCallback } from 'react';
import { useSmartEditorZoom } from '@app/hooks/settings/use-setting';

export const EDITOR_SCALE_CSS_VAR = '--kabal-editor-scale';

export const DEFAULT = 100;
export const STEP = 1;
export const MIN = 10;
export const MAX = 500;

const USER_STEP = 5;

export let CURRENT_SCALE = DEFAULT / 100;

export const useScaleState = () => {
  const { value = DEFAULT, setValue } = useSmartEditorZoom();

  CURRENT_SCALE = value / 100;

  const scaleUp = useCallback(
    () =>
      setValue((v = DEFAULT) => {
        const snapped = snapUp(v);
        CURRENT_SCALE = snapped / 100;

        return snapped;
      }),
    [setValue],
  );
  const scaleDown = useCallback(
    () =>
      setValue((v = DEFAULT) => {
        const snapped = snapDown(v);
        CURRENT_SCALE = snapped / 100;

        return snapped;
      }),
    [setValue],
  );

  return { scaleUp, scaleDown, setValue, value };
};

const snapUp = (value: number) => {
  if (value === MAX) {
    return value;
  }

  return value + USER_STEP - (value % USER_STEP);
};

const snapDown = (value: number) => {
  if (value === MIN) {
    return value;
  }

  const rest = value % USER_STEP;

  if (rest === 0) {
    return value - USER_STEP;
  }

  return value - rest;
};
