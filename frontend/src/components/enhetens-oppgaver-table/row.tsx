import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { isoDateToPretty } from '../../domene/datofunksjoner';
import { useHjemmelFromId, useTemaFromId, useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { IKlagebehandling, useTildelSaksbehandlerMutation } from '../../redux-api/oppgaver';
import { LabelMain, LabelMedunderskriver, LabelTema } from '../../styled-components/labels';

export const Row = ({
  id,
  type,
  tema,
  hjemmel,
  frist,
  ageKA,
  klagebehandlingVersjon,
  tildeltSaksbehandlerNavn,
  harMedunderskriver,
}: IKlagebehandling): JSX.Element => {
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
