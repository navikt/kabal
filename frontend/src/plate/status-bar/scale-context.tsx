import { createContext, useMemo } from 'react';
import { EDITOR_SCALE_CSS_VAR, useScaleState } from '@app/components/smart-editor/hooks/use-scale';
import { ScalingGroup } from '@app/hooks/settings/use-setting';

const NOOP = () => {};

export const ScaleContext = createContext<ReturnType<typeof useScaleState>>({
  scale: 1,
  setScale: NOOP,
  scaleUp: NOOP,
  scaleDown: NOOP,
});

interface Props {
  children: React.ReactNode;
  zoomGroup: ScalingGroup;
}

export const ScaleContextComponent = ({ children, zoomGroup }: Props) => {
  const scaleState = useScaleState(zoomGroup);

  const { scale } = scaleState;

  const scalingStyle = useMemo<Record<string, string>>(
    () => ({
      [EDITOR_SCALE_CSS_VAR]: (scale / 100).toString(10),
      display: 'flex',
      flexGrow: '1',
      flexShrink: '0',
      flexDirection: 'column',
      overflow: 'hidden',
      maxHeight: '100%',
    }),
    [scale],
  );

  return (
    <ScaleContext.Provider value={scaleState}>
      <div style={scalingStyle}>{children}</div>
    </ScaleContext.Provider>
  );
};
