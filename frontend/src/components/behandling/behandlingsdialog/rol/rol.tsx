import React from 'react';
import { styled } from 'styled-components';
import { SelectRol } from '@app/components/behandling/behandlingsdialog/rol/select-rol';
import { SendToRol } from '@app/components/behandling/behandlingsdialog/rol/send-to-rol';
import { SendToSaksbehandler } from '@app/components/behandling/behandlingsdialog/rol/send-to-saksbehandler';
import { SKELETON } from '@app/components/behandling/behandlingsdialog/rol/skeleton';
import { RolStateText } from '@app/components/behandling/behandlingsdialog/rol/state-text';
import { TakeFromRol } from '@app/components/behandling/behandlingsdialog/rol/take-from-rol';
import { TakeFromSaksbehandler } from '@app/components/behandling/behandlingsdialog/rol/take-from-saksbehandler';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IAnkebehandling, IKlagebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { RolReadOnly } from './read-only';

export const Rol = () => {
  const { data: oppgave, isLoading } = useOppgave();

  if (isLoading || oppgave === undefined) {
    return SKELETON;
  }

  if (oppgave.typeId !== SaksTypeEnum.KLAGE && oppgave.typeId !== SaksTypeEnum.ANKE) {
    return null;
  }

  return <RolInternal oppgave={oppgave} />;
};

interface Props {
  oppgave: IKlagebehandling | IAnkebehandling;
}

const RolInternal = ({ oppgave }: Props) => {
  const isSaksbehandler = useIsSaksbehandler();
  const isRol = useIsRol();
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const isKrol = useHasRole(Role.KABAL_KROL);

  const { rol } = oppgave;

  const isReadOnly = isFinished || isFeilregistrert || (!isSaksbehandler && !isRol && !isKrol);

  if (isReadOnly) {
    if (rol.navIdent === null) {
      return null;
    }

    return (
      <Container>
        <RolReadOnly rol={rol} />
      </Container>
    );
  }

  return (
    <Container>
      <SelectRol oppgaveId={oppgave.id} isSaksbehandler={isSaksbehandler} rol={oppgave.rol} />
      <RolStateText isSaksbehandler={isSaksbehandler} rol={oppgave.rol} />
      <SendToRol oppgaveId={oppgave.id} isSaksbehandler={isSaksbehandler} rol={rol} />
      <SendToSaksbehandler oppgaveId={oppgave.id} isSaksbehandler={isSaksbehandler} />
      <TakeFromRol oppgaveId={oppgave.id} isSaksbehandler={isSaksbehandler} rol={rol} />
      <TakeFromSaksbehandler oppgaveId={oppgave.id} />
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;
