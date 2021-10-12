import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useIsFullfoert } from '../../../../hooks/use-is-fullfoert';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { useGetKlagebehandlingQuery } from '../../../../redux-api/oppgave';
import { MedunderskriverInfo } from './medunderskriver-info';
import { SelectMedunderskriver } from './select-medunderskriver';
import { SendTilMedunderskriver } from './send-til-medunderskriver';
import { SendTilSaksbehandler } from './send-til-saksbehandler';

export const Medunderskriver = (): JSX.Element => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);
  const isFullfoert = useIsFullfoert(klagebehandlingId);

  if (typeof klagebehandling === 'undefined') {
    return <NavFrontendSpinner />;
  }

  if (isFullfoert) {
    return <MedunderskriverInfo klagebehandling={klagebehandling} />;
  }

  return (
    <>
      <MedunderskriverInfo klagebehandling={klagebehandling} />
      <SelectMedunderskriver klagebehandling={klagebehandling} />
      <SendTilMedunderskriver klagebehandling={klagebehandling} />
      <SendTilSaksbehandler klagebehandling={klagebehandling} />
    </>
  );
};
