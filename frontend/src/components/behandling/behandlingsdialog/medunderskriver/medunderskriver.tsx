// import { Select } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
// import styled from 'styled-components';
import { IUserData } from '../../../../redux-api/bruker';
import {
  // IMedunderskriver,
  useGetMedunderskrivereQuery,
  useSwitchMedunderskriverflytMutation,
  useUpdateChosenMedunderskriverMutation,
} from '../../../../redux-api/medunderskrivere';
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
  const [switchMedunderskriverflyt] = useSwitchMedunderskriverflytMutation();

  if (typeof medunderskrivereData === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const { medunderskrivere } = medunderskrivereData;

  if (medunderskrivere.length === 0) {
    return <p>Fant ingen medunderskrivere</p>;
  }

  const onChangeChosenMedunderskriver = (medunderskriverident: string) => {
    const { id, klagebehandlingVersjon } = klagebehandling;
    const queryObj = {
      klagebehandlingId: id,
      klagebehandlingVersjon,
      medunderskriverident,
    };

    updateChosenMedunderskriver(queryObj);
  };

  const onSendToMedunderskriver = () => {
    const { id } = klagebehandling;

    switchMedunderskriverflyt({ klagebehandlingId: id });
  };

  return (
    <>
      <SelectMedunderskriver
        medunderskrivere={medunderskrivereData.medunderskrivere}
        onChangeChosenMedunderskriver={onChangeChosenMedunderskriver}
        sentToMedunderskriverNavIdent={klagebehandling.medunderskriverident}
      />
      <SendTilMedunderskriver klagebehandling={klagebehandling} onSendToMedunderskriver={onSendToMedunderskriver} />
    </>
  );
};
