import { SmartEditorContext } from '@app/components/smart-editor/context';
import { GodFormulering } from '@app/components/smart-editor/gode-formuleringer/god-formulering';
import { GodeFormuleringerExpandState } from '@app/hooks/settings/use-setting';
import type { NonNullableGodFormulering } from '@app/types/texts/consumer';
import { Alert, BoxNew } from '@navikt/ds-react';
import { useContext, useEffect } from 'react';

interface ListProps {
  isLoading: boolean;
  texts: NonNullableGodFormulering[];
  focused: number;
  setFocused: (index: number) => void;
  expandState: Map<string, GodeFormuleringerExpandState>;
  setExpandState: (state: Map<string, GodeFormuleringerExpandState>) => void;
}

export const GodeFormuleringerList = ({
  texts,
  isLoading,
  focused,
  setFocused,
  expandState,
  setExpandState,
}: ListProps) => {
  const { godeFormuleringerExpandState } = useContext(SmartEditorContext);

  useEffect(() => {
    setExpandState(texts.reduce((acc, t) => acc.set(t.id, godeFormuleringerExpandState), new Map()));
  }, [texts, godeFormuleringerExpandState, setExpandState]);

  if (isLoading) {
    return (
      <>
        <BoxNew
          background="neutral-soft"
          borderWidth="4"
          className="border-transparent"
          borderRadius="medium"
          shadow="dialog"
          height="316px"
        />

        <BoxNew
          background="neutral-soft"
          borderWidth="4"
          className="border-transparent"
          borderRadius="medium"
          shadow="dialog"
          height="316px"
        />

        <BoxNew
          background="neutral-soft"
          borderWidth="4"
          className="mb-96 border-transparent"
          borderRadius="medium"
          shadow="dialog"
          height="316px"
        />
      </>
    );
  }

  const toggleExpanded = (id: string, state: GodeFormuleringerExpandState) => {
    setExpandState(new Map(expandState).set(id, state));
  };

  return texts.length === 0 ? (
    <Alert variant="info" size="small">
      Ingen gode formuleringer funnet.
    </Alert>
  ) : (
    texts.map((t, i) => (
      <GodFormulering
        key={t.id}
        {...t}
        isFocused={focused === i}
        onClick={() => setFocused(i)}
        expandState={expandState.get(t.id) ?? GodeFormuleringerExpandState.PREVIEW}
        setExpandState={(state) => toggleExpanded(t.id, state)}
      />
    ))
  );
};
