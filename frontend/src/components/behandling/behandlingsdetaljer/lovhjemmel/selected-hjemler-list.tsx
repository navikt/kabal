import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useAllLovkildeToRegistreringshjemmelForYtelse } from '@app/hooks/use-kodeverk-value';
import type { ILovKildeToRegistreringshjemmel } from '@app/types/kodeverk';
import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import {
  StyledListItem,
  StyledNoneSelected,
  StyledSelectedHjemler,
  StyledSelectedList,
  StyledSelectedSection,
  StyledSelectedSectionHeader,
} from './styled-components';

interface Props {
  selected: string[];
}

export const SelectedHjemlerList = ({ selected }: Props) => {
  const { data: oppgave } = useOppgave();

  const hjemler = useAllLovkildeToRegistreringshjemmelForYtelse(oppgave?.ytelseId ?? skipToken);

  const list = useMemo<ILovKildeToRegistreringshjemmel[]>(
    () =>
      hjemler
        .map(({ lovkilde, registreringshjemler }) => ({
          lovkilde,
          registreringshjemler: registreringshjemler.filter((registreringshjemmel) =>
            selected.includes(registreringshjemmel.id),
          ),
        }))
        .filter(({ registreringshjemler }) => registreringshjemler.length > 0),
    [selected, hjemler],
  );

  if (typeof oppgave === 'undefined') {
    return <Loader size="xlarge" />;
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
