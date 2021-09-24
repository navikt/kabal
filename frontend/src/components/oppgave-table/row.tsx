import React, { useCallback } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { IKlagebehandling, useTildelSaksbehandlerMutation } from '../../redux-api/oppgaver';
import { useTemaFromId, useTypeFromId, useHjemmelFromId } from '../../hooks/useKodeverkIds';
import { isoDateToPretty } from '../../domene/datofunksjoner';
import { EtikettMain, EtikettTema } from '../../styled-components/Etiketter';

export const Row: React.FC<IKlagebehandling> = ({ id, type, tema, hjemmel, frist, ageKA, klagebehandlingVersjon }) => {
  const [tildelSaksbehandler, loader] = useTildelSaksbehandlerMutation();
  const { data: userData, isLoading: isUserLoading } = useGetBrukerQuery();

  const onTildel = useCallback(() => {
    if (typeof userData === 'undefined') {
      return;
    }
    tildelSaksbehandler({
      oppgaveId: id,
      klagebehandlingVersjon,
      navIdent: userData.info.navIdent,
      enhetId: userData.valgtEnhetView.id,
    });
  }, [id, klagebehandlingVersjon, userData, tildelSaksbehandler]);

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
