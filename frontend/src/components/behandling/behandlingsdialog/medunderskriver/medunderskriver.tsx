import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useKlagebehandlingId } from '../../../../hooks/use-klagebehandling-id';
import { useGetBrukerQuery } from '../../../../redux-api/bruker';
import {
  useGetKlagebehandlingQuery,
  useGetMedunderskrivereQuery,
  useUpdateChosenMedunderskriverMutation,
} from '../../../../redux-api/oppgave';
import { SelectMedunderskriver } from './select-medunderskriver';
import { SendTilMedunderskriver } from './send-til-medunderskriver';

export const Medunderskriver = (): JSX.Element => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);
  const { data: bruker } = useGetBrukerQuery();
  const [updateChosenMedunderskriver] = useUpdateChosenMedunderskriverMutation();

  const medunderskrivereQuery =
    typeof bruker === 'undefined' || typeof klagebehandling === 'undefined'
      ? skipToken
      : {
          id: bruker.info.navIdent,
          tema: klagebehandling.tema,
        };

  const { data: medunderskrivereData } = useGetMedunderskrivereQuery(medunderskrivereQuery);

  if (
    typeof medunderskrivereData === 'undefined' ||
    typeof klagebehandling === 'undefined' ||
    typeof bruker === 'undefined'
  ) {
    return <NavFrontendSpinner />;
  }

  if (medunderskrivereData.medunderskrivere.length === 0) {
    return <p>Fant ingen medunderskrivere</p>;
  }

  const onChangeChosenMedunderskriver = (medunderskriverident: string | null) =>
    updateChosenMedunderskriver({
      klagebehandlingId: klagebehandling.id,
      medunderskriverident,
    });

  return (
    <>
      <SelectMedunderskriver
        medunderskrivere={medunderskrivereData.medunderskrivere}
        onChangeChosenMedunderskriver={onChangeChosenMedunderskriver}
        selectedMedunderskriverNavIdent={klagebehandling.medunderskriverident}
      />
      <SendTilMedunderskriver
        klagebehandling={klagebehandling}
        medunderskrivere={medunderskrivereData.medunderskrivere}
      />
    </>
  );
};
