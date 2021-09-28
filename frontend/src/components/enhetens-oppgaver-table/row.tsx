import React, { useCallback } from 'react';
import { useTemaFromId, useTypeFromId, useHjemmelFromId } from '../../hooks/use-kodeverk-ids';
import { isoDateToPretty } from '../../domene/datofunksjoner';
import { Knapp } from 'nav-frontend-knapper';
import { IKlagebehandling, useTildelSaksbehandlerMutation } from '../../redux-api/oppgaver';
import { LabelMain, LabelTema, LabelMedunderskriver } from '../../styled-components/labels';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { NavLink } from 'react-router-dom';

export const Row: React.FC<IKlagebehandling> = ({
  id,
  type,
  tema,
  hjemmel,
  frist,
  ageKA,
  klagebehandlingVersjon,
  person,
  tildeltSaksbehandlerNavn,
  harMedunderskriver,
}) => {
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
        <LabelMain>{useTypeFromId(type)}</LabelMain>
      </td>
      <td>
        <LabelTema tema={tema}>{useTemaFromId(tema)}</LabelTema>
      </td>
      <td>
        <LabelMain>{useHjemmelFromId(hjemmel)}</LabelMain>
      </td>
      <td>{person?.fnr}</td>
      <td>{ageKA} dager</td>
      <td>{isoDateToPretty(frist)}</td>
      <td>{tildeltSaksbehandlerNavn}</td>
      <td>{harMedunderskriver ? <LabelMedunderskriver>Sendt til medunderskriver</LabelMedunderskriver> : ''}</td>
      <td>
        <NavLink className="knapp knapp--hoved" to={`/klagebehandling/${id}`}>
          Åpne
        </NavLink>
      </td>
      <td>
        <Knapp onClick={onTildel} spinner={isLoading} disabled={isLoading}>
          {getFradelText(loader.isLoading)}
        </Knapp>
      </td>
    </tr>
  );
};

const getFradelText = (loading: boolean) => (loading ? 'Legger tilbake...' : 'Legg tilbake');
