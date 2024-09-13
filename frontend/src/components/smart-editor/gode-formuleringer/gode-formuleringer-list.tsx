import { GodFormulering } from '@app/components/smart-editor/gode-formuleringer/god-formulering';
import { StyledSkeleton } from '@app/components/smart-editor/gode-formuleringer/styles';
import type { NonNullableGodFormulering } from '@app/types/texts/consumer';
import { Alert } from '@navikt/ds-react';

interface ListProps {
  isLoading: boolean;
  texts: NonNullableGodFormulering[];
  focused: number;
  setFocused: (index: number) => void;
}

export const GodeFormuleringerList = ({ texts, isLoading, focused, setFocused }: ListProps) => {
  if (isLoading) {
    return (
      <>
        <StyledSkeleton variant="rectangle" height={339} />
        <StyledSkeleton variant="rectangle" height={339} />
        <StyledSkeleton variant="rectangle" height={339} />
      </>
    );
  }

  return texts.length === 0 ? (
    <Alert variant="info" size="small">
      Ingen gode formuleringer funnet.
    </Alert>
  ) : (
    texts.map((t, i) => <GodFormulering key={t.id} {...t} isFocused={focused === i} onClick={() => setFocused(i)} />)
  );
};
