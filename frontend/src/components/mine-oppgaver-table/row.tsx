import React, { useCallback } from 'react';
import { useTemaFromId, useTypeFromId, useHjemmelFromId } from '../../hooks/useKodeverkIds';
import { isoDateToPretty } from '../../domene/datofunksjoner';
import { Knapp } from 'nav-frontend-knapper';
import { IKlagebehandling, useFradelSaksbehandlerMutation } from '../../redux-api/oppgaver';
import { EtikettMain, EtikettTema } from '../../styled-components/Etiketter';
import { useGetBrukerQuery, useGetValgtEnhetQuery } from '../../redux-api/bruker';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { NavLink } from 'react-router-dom';

export const Row: React.FC<IKlagebehandling> = ({
  id,
  type,
  tema,
  hjemmel,
  frist,
  klagebehandlingVersjon,
  person,
  ageKA,
}) => {
  const [fradelSaksbehandler, loader] = useFradelSaksbehandlerMutation();
  const { data: bruker, isLoading: isUserLoading } = useGetBrukerQuery();
  const { data: valgtEnhet } = useGetValgtEnhetQuery(bruker?.onPremisesSamAccountName ?? skipToken);

  const onFradel = useCallback(() => {
    if (typeof bruker?.onPremisesSamAccountName === 'undefined' || typeof valgtEnhet?.id === 'undefined') {
      return;
    }
    fradelSaksbehandler({
      oppgaveId: id,
      klagebehandlingVersjon,
      navIdent: bruker.onPremisesSamAccountName,
      enhetId: valgtEnhet.id,
    });
  }, [id, klagebehandlingVersjon, bruker?.onPremisesSamAccountName, valgtEnhet?.id, fradelSaksbehandler]);

  const isLoading = loader.isLoading || isUserLoading;

  return (
    <tr>
      <td>
        <EtikettMain>{useTypeFromId(type)}</EtikettMain>
      </td>
      <td>
        <EtikettTema tema={tema}>{useTemaFromId(tema)}</EtikettTema>
      </td>
      <td>
        <EtikettMain>{useHjemmelFromId(hjemmel)}</EtikettMain>
      </td>
      <td>{person?.navn}</td>
      <td>{person?.fnr}</td>
      <td>{ageKA} dager</td>
      <td>{isoDateToPretty(frist)}</td>
      <td>
        <NavLink className="knapp knapp--hoved" to={`/klagebehandling/${id}`}>
          Åpne
        </NavLink>
      </td>
      <td>
        <Knapp onClick={onFradel} spinner={isLoading} disabled={isLoading}>
          {getFradelText(loader.isLoading)}
        </Knapp>
      </td>
    </tr>
  );
};

const getFradelText = (loading: boolean) => (loading ? 'Legger tilbake...' : 'Legg tilbake');
