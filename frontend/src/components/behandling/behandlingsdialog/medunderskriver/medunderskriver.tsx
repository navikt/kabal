import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { useIsAssignee } from '../../../../hooks/use-is-assignee';
import { useIsFullfoert } from '../../../../hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '../../../../hooks/use-is-saksbehandler';
import { useOppgaveId } from '../../../../hooks/use-oppgave-id';
import { useGetMedunderskriverQuery, useGetMedunderskriverflytQuery } from '../../../../redux-api/oppgavebehandling';
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
  const options = isFullfoert ? undefined : { pollingInterval: 3 * 1000 };

  const { data: medunderskriver } = useGetMedunderskriverQuery(oppgaveId, isSaksbehandler ? undefined : options);
  const { data: medunderskriverflyt } = useGetMedunderskriverflytQuery(oppgaveId, isAssignee ? undefined : options);

  if (
    typeof oppgave === 'undefined' ||
    typeof medunderskriver === 'undefined' ||
    typeof medunderskriverflyt === 'undefined'
  ) {
    return <NavFrontendSpinner />;
  }

  if (oppgave.strengtFortrolig === true) {
    return null;
  }

  if (isFullfoert) {
    return (
      <MedunderskriverInfo
        tildeltSaksbehandler={oppgave.tildeltSaksbehandler}
        medunderskriver={medunderskriver.medunderskriver}
      />
    );
  }

  return (
    <>
      <MedunderskriverInfo
        tildeltSaksbehandler={oppgave.tildeltSaksbehandler}
        medunderskriver={medunderskriver.medunderskriver}
      />
      <SelectMedunderskriver
        ytelse={oppgave.ytelse}
        type={oppgave.type}
        id={oppgave.id}
        medunderskriver={medunderskriver.medunderskriver}
      />
      <SendTilMedunderskriver
        id={oppgave.id}
        medunderskriver={medunderskriver.medunderskriver}
        medunderskriverFlyt={medunderskriverflyt.medunderskriverFlyt}
      />
      <SendTilSaksbehandler id={oppgave.id} medunderskriverFlyt={medunderskriverflyt.medunderskriverFlyt} />
    </>
  );
};
