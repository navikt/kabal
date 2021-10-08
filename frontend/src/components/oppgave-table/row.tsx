import { Knapp } from 'nav-frontend-knapper';
import React, { useCallback } from 'react';
import { isoDateToPretty } from '../../domene/datofunksjoner';
import { useHjemmelFromId, useTemaFromId, useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { IKlagebehandling, useTildelSaksbehandlerMutation } from '../../redux-api/oppgaver';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { StyledAge, StyledDeadline } from './styled-components';

export const Row = ({
  id,
  type,
  tema,
  hjemmel,
  frist,
  ageKA,
  klagebehandlingVersjon,
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
      <td>
        <StyledAge age={ageKA}>
          {ageKA} {ageKA === 1 ? 'dag' : 'dager'}
        </StyledAge>
      </td>
      <td>
        <StyledDeadline age={ageKA} dateTime={frist}>
          {isoDateToPretty(frist)}
        </StyledDeadline>
      </td>
      <td>
        <Knapp onClick={onTildel} spinner={isLoading} disabled={isLoading}>
          {getTildelText(loader.isLoading)}
        </Knapp>
      </td>
    </tr>
  );
};

const getTildelText = (loading: boolean) => (loading ? 'Tildeler...' : 'Tildel meg');
