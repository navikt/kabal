import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useKlagebehandling } from '../../../../hooks/use-klagebehandling';
import { useLovkildeToRegistreringshjemmelForYtelse } from '../../../../hooks/use-kodeverk-value';
import { useValidationError } from '../../../../hooks/use-validation-error';
import { useGetBrukerQuery } from '../../../../redux-api/bruker';
import { useUpdateHjemlerMutation } from '../../../../redux-api/oppgave';
import { LovhjemmelSelect } from './lovhjemmel-select';
import { SelectedHjemlerList } from './selected-hjemler-list';

export const Lovhjemmel = () => {
  const { data: user } = useGetBrukerQuery();
  const [updateHjemler] = useUpdateHjemlerMutation();
  const [klagebehandling] = useKlagebehandling();
  const canEdit = useCanEdit();
  const validationError = useValidationError('hjemmel');
  const lovKildeToRegistreringshjemler = useLovkildeToRegistreringshjemmelForYtelse(
    klagebehandling?.ytelse ?? skipToken
  );

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

  if (typeof klagebehandling === 'undefined' || typeof user === 'undefined') {
    return null;
  }

  const noHjemler = options.length === 0;

  const onLovhjemmelChange = (hjemler: string[]) => {
    if (typeof user === 'undefined') {
      return;
    }

    updateHjemler({
      klagebehandlingId: klagebehandling.id,
      hjemler,
    });
  };

  return (
    <>
      <StyledHeader>Utfallet er basert på lovhjemmel:</StyledHeader>
      <LovhjemmelSelect
        disabled={!canEdit || noHjemler}
        options={options}
        selected={klagebehandling.resultat.hjemler}
        onChange={onLovhjemmelChange}
        error={validationError}
        data-testid="lovhjemmel"
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
`;