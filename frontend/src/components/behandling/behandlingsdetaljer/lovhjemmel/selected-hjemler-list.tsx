import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useMemo } from 'react';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { useLovkildeToRegistreringshjemmelForYtelse } from '../../../../hooks/use-kodeverk-value';
import { ILovKildeToRegistreringshjemmel } from '../../../../types/kodeverk';
import {
  StyledListItem,
  StyledNoneSelected,
  StyledSelectedHjemler,
  StyledSelectedList,
  StyledSelectedSection,
  StyledSelectedSectionHeader,
} from './styled-components';

const EMPTY_LIST: string[] = [];

export const SelectedHjemlerList = () => {
  const { data: oppgave } = useOppgave();

  const hjemler = useLovkildeToRegistreringshjemmelForYtelse(oppgave?.ytelse ?? skipToken);

  const hjemmelIdList = oppgave?.resultat.hjemler ?? EMPTY_LIST;

  const list = useMemo<ILovKildeToRegistreringshjemmel[]>(
    () =>
      hjemler
        .map(({ lovkilde, registreringshjemler }) => ({
          lovkilde,
          registreringshjemler: registreringshjemler.filter((registreringshjemmel) =>
            hjemmelIdList.includes(registreringshjemmel.id)
          ),
        }))
        .filter(({ registreringshjemler }) => registreringshjemler.length !== 0),
    [hjemmelIdList, hjemler]
  );

  if (typeof oppgave === 'undefined') {
    return <NavFrontendSpinner />;
  }

  return (
    <StyledSelectedHjemler>
      <SelectedChildren registreringshjemmelIdList={list} />
    </StyledSelectedHjemler>
  );
};

const SelectedChildren = ({
  registreringshjemmelIdList,
}: {
  registreringshjemmelIdList: ILovKildeToRegistreringshjemmel[];
}) => {
  if (registreringshjemmelIdList.length === 0) {
    return <StyledNoneSelected>Ingen valgte hjemler</StyledNoneSelected>;
  }

  return (
    <>
      {registreringshjemmelIdList.map(({ lovkilde, registreringshjemler }) => (
        <StyledSelectedSection key={lovkilde.id}>
          <StyledSelectedSectionHeader>{lovkilde.navn}</StyledSelectedSectionHeader>

          <StyledSelectedList>
            {registreringshjemler.map(({ navn, id }) => (
              <StyledListItem key={id}>{navn}</StyledListItem>
            ))}
          </StyledSelectedList>
        </StyledSelectedSection>
      ))}
    </>
  );
};
