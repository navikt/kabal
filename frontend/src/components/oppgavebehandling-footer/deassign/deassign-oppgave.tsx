import { ChevronUpIcon, FolderFileIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { Direction } from '@app/components/deassign/direction';
import { PaaVentWarning } from '@app/components/deassign/paa-vent-warning';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useOppgaveActions } from '@app/hooks/use-oppgave-actions';
import { useTildelSaksbehandlerMutation } from '@app/redux-api/oppgaver/mutations/tildeling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Popup } from '../../deassign/popup';

export const DeassignOppgave = () => {
  const { data: oppgave } = useOppgave();
  const [isOpen, setIsOpen] = useState(false);
  const [warningIsOpen, setWarningIsOpen] = useState(false);
  const [, { isLoading }] = useTildelSaksbehandlerMutation();
  const ref = useRef<HTMLDivElement>(null);
  const canEdit = useCanEdit();
  const [oppgaveActions, oppgaveActionsIsLoading] = useOppgaveActions(
    oppgave?.tildeltSaksbehandlerident ?? null,
    typeof oppgave === 'undefined' || oppgave.medunderskriver.navIdent !== null, // Assume medunderskriver exists.
  );

  useOnClickOutside(ref, () => setIsOpen(false), true);

  if (
    !canEdit ||
    oppgave === undefined ||
    oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ||
    oppgave.feilregistrering !== null
  ) {
    return null;
  }

  if (oppgaveActionsIsLoading) {
    return (
      <Container>
        <StyledButton variant="secondary" size="small" disabled loading icon={<FolderFileIcon aria-hidden />}>
          Legg tilbake
        </StyledButton>
      </Container>
    );
  }

  const Icon = isOpen ? ChevronUpIcon : FolderFileIcon;

  const onClick = () => {
    if (oppgave.sattPaaVent !== null) {
      setWarningIsOpen(!warningIsOpen);
      setIsOpen(false);
    } else {
      setIsOpen(!isOpen);
      setWarningIsOpen(false);
    }
  };

  const onConfirm = () => {
    setWarningIsOpen(false);
    setIsOpen(true);
  };

  const disabled = !oppgaveActions.deassignSelf;
  const title = disabled
    ? 'Oppgaven kan ikke legges tilbake på felles kø. Dette kan være pga. manglende tilgang eller fordi oppgaven har en medunderskriver.'
    : undefined;

  return (
    <Container ref={ref}>
      <Button
        disabled={disabled}
        variant="secondary"
        size="small"
        onClick={onClick}
        loading={isLoading}
        title={title}
        icon={<Icon aria-hidden />}
      >
        Legg tilbake
      </Button>
      <PaaVentWarning isOpen={warningIsOpen} close={() => setWarningIsOpen(false)} onConfirm={onConfirm} />
      {isOpen ? (
        <Popup
          direction={Direction.UP}
          close={() => setIsOpen(false)}
          oppgaveId={oppgave.id}
          typeId={oppgave.typeId}
          ytelseId={oppgave.ytelseId}
        />
      ) : null}
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const StyledButton = styled(Button)`
  min-width: 275px;
`;
