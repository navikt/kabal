import { HelpText } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useLovkildeToRegistreringshjemmelForYtelse } from '../../../../hooks/use-kodeverk-value';
import { useValidationError } from '../../../../hooks/use-validation-error';
import { useGetBrukerQuery } from '../../../../redux-api/bruker';
import { useUpdateRegistreringshjemlerMutation } from '../../../../redux-api/oppgaver/mutations/set-registreringshjemler';
import { LovhjemmelSelect } from './lovhjemmel-select';
import { SelectedHjemlerList } from './selected-hjemler-list';

export const Lovhjemmel = () => {
  const { data: user } = useGetBrukerQuery();
  const [updateHjemler] = useUpdateRegistreringshjemlerMutation();
  const { data: oppgave } = useOppgave();
  const canEdit = useCanEdit();
  const validationError = useValidationError('hjemmel');
  const lovKildeToRegistreringshjemler = useLovkildeToRegistreringshjemmelForYtelse(oppgave?.ytelse ?? skipToken);

  const options = useMemo(
    () =>
      lovKildeToRegistreringshjemler.map(({ lovkilde, registreringshjemler }) => ({
        sectionHeader: {
          id: lovkilde.id,
          name: lovkilde.navn,
        },
        sectionOptions: registreringshjemler.map(({ id, navn }) => ({
          value: id,
          label: navn,
        })),
      })),
    [lovKildeToRegistreringshjemler]
  );

  if (typeof oppgave === 'undefined' || typeof user === 'undefined') {
    return null;
  }

  const noHjemler = options.length === 0;

  const onLovhjemmelChange = (hjemler: string[]) => {
    if (typeof user === 'undefined') {
      return;
    }

    updateHjemler({
      oppgaveId: oppgave.id,
      hjemler,
    });
  };

  return (
    <>
      <StyledHeaderHelpTextWrapper>
        <StyledHeader>Utfallet er basert på lovhjemmel:</StyledHeader>
        <HelpText>
          Hjemlene skal i utgangspunktet være de samme som i klagevedtaket. Dersom saken har flere klagetemaer og
          kvaliteten er bra nok på det ene og mangelfull på det andre, velger du de hjemlene kvalitetsavviket gjelder.
        </HelpText>
      </StyledHeaderHelpTextWrapper>
      <LovhjemmelSelect
        disabled={!canEdit || noHjemler}
        options={options}
        selected={oppgave.resultat.hjemler}
        onChange={onLovhjemmelChange}
        error={validationError}
        showFjernAlle={false}
        show={canEdit}
      />
      <SelectedHjemlerList />
    </>
  );
};

const StyledHeader = styled.h2`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const StyledHeaderHelpTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
