import { Direction } from '@app/components/deassign/direction';
import { PaaVentWarning } from '@app/components/deassign/paa-vent-warning';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useOppgaveActions } from '@app/hooks/use-oppgave-actions';
import { useTildelSaksbehandlerMutation } from '@app/redux-api/oppgaver/mutations/tildeling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { ChevronUpIcon, FolderFileIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { Popup } from '../../deassign/popup';

interface Props {
  oppgave: IOppgavebehandling;
}

export const DeassignOppgave = ({ oppgave }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [warningIsOpen, setWarningIsOpen] = useState(false);
  const [, { isLoading }] = useTildelSaksbehandlerMutation();
  const ref = useRef<HTMLDivElement>(null);
  const canEdit = useCanEdit();
  const [oppgaveActions, oppgaveActionsIsLoading] = useOppgaveActions(
    oppgave.saksbehandler?.navIdent ?? null,
    oppgave.medunderskriver.employee?.navIdent ?? null,
    oppgave.medunderskriver.flowState,
    oppgave.rol.flowState,
  );

  useOnClickOutside(ref, () => setIsOpen(false), true);

  if (
    !canEdit ||
    oppgave === undefined ||
    oppgave.feilregistrering !== null ||
    oppgave.typeId === SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET
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
          hjemmelIdList={oppgave.hjemmelIdList}
          redirect
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
