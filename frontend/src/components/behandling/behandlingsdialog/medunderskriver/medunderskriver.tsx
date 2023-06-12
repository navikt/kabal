import { Loader } from '@navikt/ds-react';
import React from 'react';
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

  const { data: medunderskriver } = useGetMedunderskriverQuery(
    oppgaveId,
    canChangeMedunderskriver ? undefined : options
  );
  const { data: medunderskriverflyt } = useGetMedunderskriverflytQuery(oppgaveId, isAssignee ? undefined : options);

  if (
    typeof oppgave === 'undefined' ||
    typeof medunderskriver === 'undefined' ||
    typeof medunderskriverflyt === 'undefined'
  ) {
    return <Loader size="xlarge" />;
  }

  if (oppgave.strengtFortrolig === true) {
    return null;
  }

  return (
    <>
      <MedunderskriverInfo
        typeId={oppgave.typeId}
        tildeltSaksbehandler={oppgave.tildeltSaksbehandler}
        medunderskriver={medunderskriver.medunderskriver}
      />
      <SelectMedunderskriver
        ytelseId={oppgave.ytelseId}
        typeId={oppgave.typeId}
        id={oppgave.id}
        medunderskriver={medunderskriver.medunderskriver}
      />
      <SendTilMedunderskriver
        id={oppgave.id}
        typeId={oppgave.typeId}
        medunderskriver={medunderskriver.medunderskriver}
        medunderskriverFlyt={medunderskriverflyt.medunderskriverFlyt}
      />
      <SendTilSaksbehandler id={oppgave.id} medunderskriverFlyt={medunderskriverflyt.medunderskriverFlyt} />
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
