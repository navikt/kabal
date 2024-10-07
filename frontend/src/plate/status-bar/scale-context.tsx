import { ReactNode, createContext, useEffect } from 'react';
import { EDITOR_SCALE_CSS_VAR, useScaleState } from '@app/components/smart-editor/hooks/use-scale';
import { ScalingGroup } from '@app/hooks/settings/use-setting';

const NOOP = () => {};

interface ScaleContextType extends ReturnType<typeof useScaleState> {
  scalingGroup: ScalingGroup;
}

export const ScaleContext = createContext<ScaleContextType>({
  scalingGroup: ScalingGroup.OPPGAVEBEHANDLING,
  scale: 100,
  setScale: NOOP,
  scaleUp: NOOP,
  scaleDown: NOOP,
});

interface Props {
  scalingGroup: ScalingGroup;
  children: ReactNode;
}

export const ScaleContextComponent = ({ scalingGroup, children }: Props) => {
  const state = useScaleState(scalingGroup);
  const { scale } = state;

  const scalingGroupVar = getScaleVarName(scalingGroup);

  useEffect(() => {
    document.documentElement.style.setProperty(scalingGroupVar, (scale / 100).toString(10));

    return () => document.documentElement.style.setProperty(scalingGroupVar, '1');
  }, [scale, scalingGroupVar]);

  return <ScaleContext.Provider value={{ ...state, scalingGroup }}>{children}</ScaleContext.Provider>;
};

const getScaleVarName = (scalingGroup: ScalingGroup) => `${EDITOR_SCALE_CSS_VAR}-${scalingGroup}`;

export const getScaleVar = (scalingGroup: ScalingGroup) => `var(${getScaleVarName(scalingGroup)})`;
