import { Button } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useOppgaveActions } from '@app/hooks/use-oppgave-actions';
import { IOppgave } from '@app/types/oppgaver';
import { useFradel } from './use-tildel';

interface Props extends IOppgave {
  children?: string;
}

export const FradelButton = ({
  id,
  type,
  ytelse,
  isAvsluttetAvSaksbehandler,
  children = 'Legg tilbake',
  tildeltSaksbehandlerident,
}: Props): JSX.Element | null => {
  const [fradel, { isLoading }] = useFradel(id, type, ytelse);
  const [access, isAccessLoading] = useOppgaveActions(ytelse, tildeltSaksbehandlerident);

  if (isAccessLoading || !access.deassign || isAvsluttetAvSaksbehandler) {
    return null;
  }

  return (
    <StyledButton
      variant="secondary"
      type="button"
      size="small"
      onClick={fradel}
      loading={isLoading}
      disabled={isLoading}
      data-testid="behandling-fradel-button"
      data-klagebehandlingid={id}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  grid-area: fradel;
  white-space: nowrap;
  width: 110px;
`;
