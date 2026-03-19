import { Box } from '@navikt/ds-react';
import { useContext, useEffect } from 'react';
import { Alert } from '@/components/alert/alert';
import { SmartEditorContext } from '@/components/smart-editor/context';
import { GodFormulering } from '@/components/smart-editor/gode-formuleringer/god-formulering';
import { GodeFormuleringerExpandState } from '@/hooks/settings/use-setting';
import type { NonNullableGodFormulering } from '@/types/texts/consumer';

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
        <Box
          background="neutral-soft"
          borderWidth="4"
          className="border-transparent"
          borderRadius="4"
          shadow="dialog"
          height="316px"
        />
        <Box
          background="neutral-soft"
          borderWidth="4"
          className="border-transparent"
          borderRadius="4"
          shadow="dialog"
          height="316px"
        />
        <Box
          background="neutral-soft"
          borderWidth="4"
          className="mb-96 border-transparent"
          borderRadius="4"
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
    <Alert variant="info">Ingen gode formuleringer funnet.</Alert>
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
