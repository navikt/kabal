import { Loader } from '@navikt/ds-react';
import React from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsAssignee } from '@app/hooks/use-is-assignee';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetMedunderskriverQuery, useGetMedunderskriverflytQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { MedunderskriverFlyt } from '@app/types/kodeverk';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { MedunderskriverInfo } from './medunderskriver-info';
import { SelectMedunderskriver } from './select-medunderskriver';
import { SendTilMedunderskriver } from './send-til-medunderskriver';
import { SendTilSaksbehandler } from './send-til-saksbehandler';

export const Medunderskriver = () => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave } = useOppgave();
  const isSaksbehandler = useIsSaksbehandler();
  const isAssignee = useIsAssignee();
  const isFullfoert = useIsFullfoert();
  const options = isFullfoert ? undefined : getOptions(isSaksbehandler, oppgave);

  const { data: medunderskriver } = useGetMedunderskriverQuery(oppgaveId, isSaksbehandler ? undefined : options);
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

  if (isFullfoert) {
    return (
      <MedunderskriverInfo
        typeId={oppgave.typeId}
        tildeltSaksbehandler={oppgave.tildeltSaksbehandler}
        medunderskriver={medunderskriver.medunderskriver}
      />
    );
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

const getOptions = (isSaksbehandler: boolean, oppgave: IOppgavebehandling | undefined) => {
  if (typeof oppgave === 'undefined') {
    return undefined;
  }

  if (isSaksbehandler && oppgave.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return { pollingInterval: 3 * 1000 };
  }

  if (!isSaksbehandler && oppgave.medunderskriverFlyt !== MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return { pollingInterval: 3 * 1000 };
  }

  return undefined;
};
