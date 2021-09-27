import React, { useCallback } from 'react';
import { useTemaFromId, useTypeFromId, useHjemmelFromId } from '../../hooks/use-kodeverk-ids';
import { isoDateToPretty } from '../../domene/datofunksjoner';
import { Knapp } from 'nav-frontend-knapper';
import { IKlagebehandling, useFradelSaksbehandlerMutation } from '../../redux-api/oppgaver';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { useGetBrukerQuery } from '../../redux-api/bruker';
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
