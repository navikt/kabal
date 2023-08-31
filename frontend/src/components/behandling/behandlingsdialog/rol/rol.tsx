import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { styled } from 'styled-components';
import { SelectRol } from '@app/components/behandling/behandlingsdialog/rol/select-rol';
import { SendToRol } from '@app/components/behandling/behandlingsdialog/rol/send-to-rol';
import { SendToSaksbehandler } from '@app/components/behandling/behandlingsdialog/rol/send-to-saksbehandler';
import { SKELETON } from '@app/components/behandling/behandlingsdialog/rol/skeleton';
import { RolStateText } from '@app/components/behandling/behandlingsdialog/rol/state-text';
import { TakeFromRol } from '@app/components/behandling/behandlingsdialog/rol/take-from-rol';
import { TakeFromSaksbehandler } from '@app/components/behandling/behandlingsdialog/rol/take-from-saksbehandler';
import { ENVIRONMENT } from '@app/environment';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetRolQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { RolReadOnly } from './read-only';

export const Rol = () => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const isSaksbehandler = useIsSaksbehandler();
  const isRol = useIsRol();
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const isEditable = !isFinished && !isFeilregistrert;

  // Poll the ROL endpoint, in case ROL is changed by another user.
  useGetRolQuery(oppgaveId, isEditable ? { pollingInterval: 3 * 1000 } : undefined);

  if (oppgaveIsLoading || oppgave === undefined || oppgaveId === skipToken) {
    return SKELETON;
  }

  // TODO: Remove when Styringsenheten has approved in dev.
  if (ENVIRONMENT.isProduction) {
    return null;
  }

  const { rol } = oppgave;

  const isReadOnly = isFinished || isFeilregistrert || (!isSaksbehandler && !isRol);

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
      <SelectRol oppgaveId={oppgaveId} isSaksbehandler={isSaksbehandler} rol={oppgave.rol} />
      <RolStateText isSaksbehandler={isSaksbehandler} rol={oppgave.rol} />
      <SendToRol oppgaveId={oppgaveId} isSaksbehandler={isSaksbehandler} rol={rol} />
      <SendToSaksbehandler oppgaveId={oppgaveId} isSaksbehandler={isSaksbehandler} rol={rol} />
      <TakeFromRol oppgaveId={oppgaveId} isSaksbehandler={isSaksbehandler} rol={rol} />
      <TakeFromSaksbehandler oppgaveId={oppgaveId} rol={rol} />
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;
