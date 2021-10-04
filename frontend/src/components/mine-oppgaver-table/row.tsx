import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { isoDateToPretty } from '../../domene/datofunksjoner';
import { useHjemmelFromId, useTemaFromId, useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { IKlagebehandling, useFradelSaksbehandlerMutation } from '../../redux-api/oppgaver';
import { LabelMain, LabelTema } from '../../styled-components/labels';

export const Row = ({
  id,
  type,
  tema,
  hjemmel,
  frist,
  klagebehandlingVersjon,
  person,
  ageKA,
}: IKlagebehandling): JSX.Element => {
  const [fradelSaksbehandler, loader] = useFradelSaksbehandlerMutation();
  const { data: userData, isLoading: isUserLoading } = useGetBrukerQuery();

  const onFradel = useCallback(() => {
    if (typeof userData === 'undefined') {
      return;
    }

    fradelSaksbehandler({
      oppgaveId: id,
      klagebehandlingVersjon,
      navIdent: userData.info.navIdent,
      enhetId: userData.valgtEnhetView.id,
    });
  }, [id, klagebehandlingVersjon, userData, fradelSaksbehandler]);

  const isLoading = loader.isLoading || isUserLoading;

  return (
    <tr>
      <td>
        <LabelMain>{useTypeFromId(type)}</LabelMain>
      </td>
      <td>
        <LabelTema tema={tema}>{useTemaFromId(tema)}</LabelTema>
      </td>
      <td>
        <LabelMain>{useHjemmelFromId(hjemmel)}</LabelMain>
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
