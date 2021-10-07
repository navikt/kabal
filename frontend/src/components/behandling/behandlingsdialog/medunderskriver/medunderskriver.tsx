import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { IUserData } from '../../../../redux-api/bruker';
import { useGetMedunderskrivereQuery, useUpdateChosenMedunderskriverMutation } from '../../../../redux-api/oppgave';
import { IKlagebehandling } from '../../../../redux-api/oppgave-state-types';
import { SelectMedunderskriver } from './select-medunderskriver';
import { SendTilMedunderskriver } from './send-til-medunderskriver';

interface MedunderskriverProps {
  klagebehandling: IKlagebehandling;
  bruker: IUserData;
}

export const Medunderskriver = ({ klagebehandling, bruker }: MedunderskriverProps): JSX.Element => {
  const medunderskrivereQuery = {
    id: bruker.info.navIdent,
    tema: klagebehandling.tema,
  };

  const { data: medunderskrivereData } = useGetMedunderskrivereQuery(medunderskrivereQuery);
  const [updateChosenMedunderskriver] = useUpdateChosenMedunderskriverMutation();

  if (typeof medunderskrivereData === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const { medunderskrivere } = medunderskrivereData;

  if (medunderskrivere.length === 0) {
    return <p>Fant ingen medunderskrivere</p>;
  }

  const onChangeChosenMedunderskriver = (medunderskriverident: string | null) => {
    updateChosenMedunderskriver({
      klagebehandlingId: klagebehandling.id,
      medunderskriverident,
    });
  };

  return (
    <>
      <SelectMedunderskriver
        medunderskrivere={medunderskrivereData.medunderskrivere}
        onChangeChosenMedunderskriver={onChangeChosenMedunderskriver}
        selectedMedunderskriverNavIdent={klagebehandling.medunderskriverident}
      />
      <SendTilMedunderskriver klagebehandling={klagebehandling} medunderskrivere={medunderskrivere} />
    </>
  );
};
