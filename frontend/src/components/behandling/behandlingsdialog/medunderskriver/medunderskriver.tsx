import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useIsAsignee } from '../../../../hooks/use-is-asignee';
import { useIsFullfoert } from '../../../../hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '../../../../hooks/use-is-saksbehandler';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import {
  useGetKlagebehandlingQuery,
  useGetMedunderskriverQuery,
  useGetMedunderskriverflytQuery,
} from '../../../../redux-api/oppgave';
import { MedunderskriverInfo } from './medunderskriver-info';
import { SelectMedunderskriver } from './select-medunderskriver';
import { SendTilMedunderskriver } from './send-til-medunderskriver';
import { SendTilSaksbehandler } from './send-til-saksbehandler';

export const Medunderskriver = () => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);
  const isSaksbehandler = useIsSaksbehandler();
  const isAsignee = useIsAsignee();
  const isFullfoert = useIsFullfoert(klagebehandlingId);
  const options = isFullfoert ? undefined : { pollingInterval: 3 * 1000 };
  const { data: medunderskriver } = useGetMedunderskriverQuery(
    klagebehandlingId,
    isSaksbehandler ? undefined : options
  );
  const { data: medunderskriverflyt } = useGetMedunderskriverflytQuery(
    klagebehandlingId,
    isAsignee ? undefined : options
  );

  if (
    typeof klagebehandling === 'undefined' ||
    typeof medunderskriver === 'undefined' ||
    typeof medunderskriverflyt === 'undefined'
  ) {
    return <NavFrontendSpinner />;
  }

  if (klagebehandling.strengtFortrolig === true) {
    return null;
  }

  if (isFullfoert) {
    return <MedunderskriverInfo klagebehandling={klagebehandling} medunderskriver={medunderskriver} />;
  }

  return (
    <>
      <MedunderskriverInfo klagebehandling={klagebehandling} medunderskriver={medunderskriver} />
      <SelectMedunderskriver klagebehandling={klagebehandling} medunderskriver={medunderskriver} />
      <SendTilMedunderskriver klagebehandling={klagebehandling} medunderskriverflyt={medunderskriverflyt} />
      <SendTilSaksbehandler klagebehandling={klagebehandling} />
    </>
  );
};
