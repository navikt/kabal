import React, { useCallback } from 'react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { Knapp } from 'nav-frontend-knapper';
import { useGetBrukerQuery, useGetValgtEnhetQuery } from '../../redux-api/bruker';
import { IKlagebehandling, useTildelSaksbehandlerMutation } from '../../redux-api/oppgaver';
import { useTemaFromId, useTypeFromId, useHjemmelFromId } from '../../hooks/useKodeverkIds';
import { isoDateToPretty } from '../../domene/datofunksjoner';
import { EtikettMain, EtikettTema } from '../../styled-components/Etiketter';

export const Row: React.FC<IKlagebehandling> = ({ id, type, tema, hjemmel, frist, ageKA, klagebehandlingVersjon }) => {
  const [tildelSaksbehandler, loader] = useTildelSaksbehandlerMutation();
  const { data: bruker, isLoading: isUserLoading } = useGetBrukerQuery();
  const { data: valgtEnhet } = useGetValgtEnhetQuery(bruker?.onPremisesSamAccountName ?? skipToken);

  const onTildel = useCallback(() => {
    if (typeof bruker?.onPremisesSamAccountName === 'undefined' || typeof valgtEnhet?.id === 'undefined') {
      return;
    }
    tildelSaksbehandler({
      oppgaveId: id,
      klagebehandlingVersjon,
      navIdent: bruker.onPremisesSamAccountName,
      enhetId: valgtEnhet.id,
    });
  }, [id, klagebehandlingVersjon, bruker?.onPremisesSamAccountName, valgtEnhet?.id, tildelSaksbehandler]);

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
      <td>{ageKA} dager</td>
      <td>{isoDateToPretty(frist)}</td>
      <td>
        <Knapp onClick={onTildel} spinner={isLoading} disabled={isLoading}>
          {getTildelText(loader.isLoading)}
        </Knapp>
      </td>
    </tr>
  );
};

const getTildelText = (loading: boolean) => (loading ? 'Tildeler...' : 'Tildel meg');
