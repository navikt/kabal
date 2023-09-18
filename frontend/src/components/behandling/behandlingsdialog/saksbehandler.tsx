import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';

export const Saksbehandler = () => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const isSaksbehandler = useIsSaksbehandler();

  if (isSaksbehandler || oppgaveIsLoading || oppgave === undefined) {
    return null;
  }

  const { tildeltSaksbehandler } = oppgave;

  return (
    <Container>
      <Label size="small">Saksbehandler</Label>
      <BodyShort>{tildeltSaksbehandler === null ? 'Ikke tildelt' : tildeltSaksbehandler.name}</BodyShort>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;
