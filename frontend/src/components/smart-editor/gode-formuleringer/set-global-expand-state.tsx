import { SmartEditorContext } from '@app/components/smart-editor/context';
import { NextExpandStateIcon, nextExpandState } from '@app/components/smart-editor/gode-formuleringer/god-formulering';
import { GodeFormuleringerExpandState } from '@app/hooks/settings/use-setting';
import { Button } from '@navikt/ds-react';
import { useContext, useMemo } from 'react';

interface Props {
  expandState: Map<string, GodeFormuleringerExpandState>;
}

export const SetGlobalExpandState = ({ expandState }: Props) => {
  const { setGodeFormuleringerExpandState } = useContext(SmartEditorContext);

  const mostUsedState = useMemo(() => {
    const stats = expandState.values().reduce(
      (acc, state) => {
        acc[state] += 1;

        return acc;
      },
      {
        [GodeFormuleringerExpandState.COLLAPSED]: 0,
        [GodeFormuleringerExpandState.PREVIEW]: 0,
        [GodeFormuleringerExpandState.FULL_RICH_TEXT]: 0,
      },
    );

    let mostUsed = GodeFormuleringerExpandState.COLLAPSED;

    for (const state of [GodeFormuleringerExpandState.PREVIEW, GodeFormuleringerExpandState.FULL_RICH_TEXT]) {
      if (stats[state] > stats[mostUsed]) {
        mostUsed = state;
      }
    }

    return mostUsed;
  }, [expandState]);

  return (
    <Button
      size="small"
      variant="tertiary-neutral"
      title={nextTitle(mostUsedState)}
      icon={<NextExpandStateIcon state={mostUsedState} />}
      onClick={() => setGodeFormuleringerExpandState(nextExpandState(mostUsedState))}
    />
  );
};

const nextTitle = (state: GodeFormuleringerExpandState) => {
  switch (state) {
    case GodeFormuleringerExpandState.COLLAPSED:
      return 'Vis kun overskriftene til gode formuleringer';
    case GodeFormuleringerExpandState.PREVIEW:
      return 'Vis overskrift og forhåndsvisning av gode formuleringer';
    case GodeFormuleringerExpandState.FULL_RICH_TEXT:
      return 'Vis gode formuleringer i sin helhet';
  }
};
