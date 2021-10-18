import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useIsFullfoert } from '../../../../hooks/use-is-fullfoert';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { useGetKlagebehandlingQuery, useGetMedunderskriverInfoQuery } from '../../../../redux-api/oppgave';
import { MedunderskriverInfo } from './medunderskriver-info';
import { SelectMedunderskriver } from './select-medunderskriver';
import { SendTilMedunderskriver } from './send-til-medunderskriver';
import { SendTilSaksbehandler } from './send-til-saksbehandler';

export const Medunderskriver = (): JSX.Element => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);
  const isFullfoert = useIsFullfoert(klagebehandlingId);
  const options = isFullfoert ? undefined : { pollingInterval: 3 * 1000 };
  const { data: medunderskriverInfo, isLoading } = useGetMedunderskriverInfoQuery(klagebehandlingId, options);

  if (typeof klagebehandling === 'undefined' || typeof medunderskriverInfo === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  if (isFullfoert) {
    return <MedunderskriverInfo klagebehandling={klagebehandling} medunderskriverInfo={medunderskriverInfo} />;
  }

  return (
    <>
      <MedunderskriverInfo klagebehandling={klagebehandling} medunderskriverInfo={medunderskriverInfo} />
      <SelectMedunderskriver klagebehandling={klagebehandling} medunderskriverInfo={medunderskriverInfo} />
      <SendTilMedunderskriver klagebehandling={klagebehandling} medunderskriverInfo={medunderskriverInfo} />
      <SendTilSaksbehandler klagebehandling={klagebehandling} medunderskriverInfo={medunderskriverInfo} />
    </>
  );
};
