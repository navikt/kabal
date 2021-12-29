import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useIsAsignee } from '../../../../hooks/use-is-asignee';
import { useIsFullfoert } from '../../../../hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '../../../../hooks/use-is-saksbehandler';
import { useOppgaveId } from '../../../../hooks/use-oppgave-id';
import { useOppgaveType } from '../../../../hooks/use-oppgave-type';
import {
  useGetMedunderskriverQuery,
  useGetMedunderskriverflytQuery,
  useGetOppgavebehandlingQuery,
} from '../../../../redux-api/oppgavebehandling';
import { IOppgavebehandlingBaseParams } from '../../../../redux-api/oppgavebehandling-params-types';
import { MedunderskriverInfo } from './medunderskriver-info';
import { SelectMedunderskriver } from './select-medunderskriver';
import { SendTilMedunderskriver } from './send-til-medunderskriver';
import { SendTilSaksbehandler } from './send-til-saksbehandler';

export const Medunderskriver = () => {
  const oppgaveId = useOppgaveId();
  const type = useOppgaveType();
  const { data: oppgave } = useGetOppgavebehandlingQuery({ oppgaveId, type });
  const isSaksbehandler = useIsSaksbehandler();
  const isAsignee = useIsAsignee();
  const isFullfoert = useIsFullfoert();
  const options = isFullfoert ? undefined : { pollingInterval: 3 * 1000 };
  const query: IOppgavebehandlingBaseParams = { oppgaveId, type };
  const { data: medunderskriver } = useGetMedunderskriverQuery(query, isSaksbehandler ? undefined : options);
  const { data: medunderskriverflyt } = useGetMedunderskriverflytQuery(query, isAsignee ? undefined : options);

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
        type={oppgave.type}
        medunderskriver={medunderskriver.medunderskriver}
        medunderskriverFlyt={medunderskriverflyt.medunderskriverFlyt}
      />
      <SendTilSaksbehandler
        id={oppgave.id}
        type={oppgave.type}
        medunderskriverFlyt={medunderskriverflyt.medunderskriverFlyt}
      />
    </>
  );
};
