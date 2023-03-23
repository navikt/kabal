import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useMemo } from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useLovkildeToRegistreringshjemmelForYtelse } from '@app/hooks/use-kodeverk-value';
import { ILovKildeToRegistreringshjemmel } from '@app/types/kodeverk';
import {
  StyledListItem,
  StyledNoneSelected,
  StyledSelectedHjemler,
  StyledSelectedHjemlerWrapper,
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
    return <Loader size="xlarge" />;
  }

  return (
    <StyledSelectedHjemlerWrapper>
      <StyledSelectedHjemler>
        <SelectedChildren registreringshjemmelIdList={list} />
      </StyledSelectedHjemler>
    </StyledSelectedHjemlerWrapper>
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
    <section data-testid="selected-hjemler-list">
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
    </section>
  );
};
