import React from 'react';
import { SKELETON } from '@app/components/behandling/behandlingsdialog/medunderskriver/skeleton';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsAssignee } from '@app/hooks/use-is-assignee';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetMedunderskriverQuery, useGetMedunderskriverflytQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { Role } from '@app/types/bruker';
import { MedunderskriverFlyt } from '@app/types/kodeverk';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { MedunderskriverInfo } from './medunderskriver-info';
import { SelectMedunderskriver } from './select-medunderskriver';
import { SendTilMedunderskriver } from './send-til-medunderskriver';
import { SendTilSaksbehandler } from './send-til-saksbehandler';

export const Medunderskriver = () => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave } = useOppgave();
  const hasOppgaveStyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const isSaksbehandler = useIsSaksbehandler();
  const isAssignee = useIsAssignee();
  const isFullfoert = useIsFullfoert();

  const canChangeMedunderskriver = isSaksbehandler || hasOppgaveStyringRole;

  const options = isFullfoert ? undefined : getOptions(canChangeMedunderskriver, oppgave);

  // Poll the medunderskriver endpoints, in case the medunderskriver is changed by another user.
  useGetMedunderskriverQuery(oppgaveId, canChangeMedunderskriver ? undefined : options);
  useGetMedunderskriverflytQuery(oppgaveId, isAssignee ? undefined : options);

  if (oppgave === undefined) {
    return SKELETON;
  }

  if (oppgave.strengtFortrolig === true) {
    return null;
  }

  return (
    <>
      <MedunderskriverInfo
        typeId={oppgave.typeId}
        tildeltSaksbehandlerident={oppgave.tildeltSaksbehandlerident}
        medunderskriverident={oppgave.medunderskriverident}
      />
      <SelectMedunderskriver
        ytelseId={oppgave.ytelseId}
        typeId={oppgave.typeId}
        id={oppgave.id}
        medunderskriverident={oppgave.medunderskriverident}
      />
      <SendTilMedunderskriver
        id={oppgave.id}
        typeId={oppgave.typeId}
        medunderskriverident={oppgave.medunderskriverident}
        medunderskriverFlyt={oppgave.medunderskriverFlyt}
      />
      <SendTilSaksbehandler id={oppgave.id} medunderskriverFlyt={oppgave.medunderskriverFlyt} />
    </>
  );
};

const getOptions = (canChangeMedunderskriver: boolean, oppgave: IOppgavebehandling | undefined) => {
  if (typeof oppgave === 'undefined') {
    return undefined;
  }

  if (canChangeMedunderskriver && oppgave.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return { pollingInterval: 3 * 1000 };
  }

  if (!canChangeMedunderskriver && oppgave.medunderskriverFlyt !== MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return { pollingInterval: 3 * 1000 };
  }

  return undefined;
};
