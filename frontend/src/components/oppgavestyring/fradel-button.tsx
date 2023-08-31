import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import { PaaVentWarning } from '@app/components/oppgavebehandling-footer/paa-vent-warning';
import { useOppgaveActions } from '@app/hooks/use-oppgave-actions';
import { IOppgave } from '@app/types/oppgaver';
import { useFradel } from './use-tildel';

export const FradelButton = ({
  id,
  typeId,
  ytelseId,
  isAvsluttetAvSaksbehandler,
  tildeltSaksbehandlerident,
  medunderskriver,
  sattPaaVent,
}: IOppgave): JSX.Element | null => {
  const [fradel, { isLoading }] = useFradel(id, typeId, ytelseId);
  const [paaVentWarningIsOpen, setPaaVentWarningIsOpen] = useState(false);
  const [access, isAccessLoading] = useOppgaveActions(
    tildeltSaksbehandlerident,
    medunderskriver.navIdent !== null,
    ytelseId,
  );

  if (isAccessLoading || !access.deassign || isAvsluttetAvSaksbehandler) {
    return null;
  }

  const onLeggTilbake = sattPaaVent === null ? fradel : () => setPaaVentWarningIsOpen(true);

  return (
    <StyledFradel>
      <StyledButton
        variant="secondary"
        type="button"
        size="small"
        onClick={onLeggTilbake}
        loading={isLoading}
        disabled={isLoading}
        data-testid="behandling-fradel-button"
        data-klagebehandlingid={id}
      >
        Legg tilbake
      </StyledButton>
      <PaaVentWarning close={() => setPaaVentWarningIsOpen(false)} onConfirm={fradel} isOpen={paaVentWarningIsOpen} />
    </StyledFradel>
  );
};

const StyledButton = styled(Button)`
  white-space: nowrap;
`;

const StyledFradel = styled.div`
  grid-area: fradel;
  position: relative;
`;
