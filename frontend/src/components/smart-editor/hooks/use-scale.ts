import { snapDown, snapUp } from '@app/functions/snap';
import { type ScalingGroup, useSmartEditorScale } from '@app/hooks/settings/use-setting';
import { useCallback } from 'react';

export const EDITOR_SCALE_CSS_VAR = '--kabal-editor-scale';

export const DEFAULT = 100;
export const STEP = 1;
export const MIN = 10;
export const MAX = 500;

const USER_STEP = 5;

export let CURRENT_SCALE = DEFAULT / 100;

export const useScaleState = (settingPrefix: ScalingGroup) => {
  const { value = DEFAULT, setValue } = useSmartEditorScale(settingPrefix);

  CURRENT_SCALE = value / 100;

  const scaleUp = useCallback(
    () =>
      setValue((v = DEFAULT) => {
        const snapped = snapUp(v, USER_STEP, MAX);
        CURRENT_SCALE = snapped / 100;

        return snapped;
      }),
    [setValue],
  );
  const scaleDown = useCallback(
    () =>
      setValue((v = DEFAULT) => {
        const snapped = snapDown(v, USER_STEP, MIN);
        CURRENT_SCALE = snapped / 100;

        return snapped;
      }),
    [setValue],
  );

  return { scaleUp, scaleDown, setScale: setValue, scale: value };
};
