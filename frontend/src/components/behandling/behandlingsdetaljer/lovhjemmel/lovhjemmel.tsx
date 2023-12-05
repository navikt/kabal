import { HelpText, Label } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useLovkildeToRegistreringshjemmelForYtelse } from '@app/hooks/use-kodeverk-value';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateRegistreringshjemlerMutation } from '@app/redux-api/oppgaver/mutations/set-registreringshjemler';
import { useUser } from '@app/simple-api-state/use-user';
import { LovhjemmelSelect } from './lovhjemmel-select';
import { SelectedHjemlerList } from './selected-hjemler-list';

export const Lovhjemmel = () => {
  const { data: user } = useUser();
  const [updateHjemler] = useUpdateRegistreringshjemlerMutation();
  const { data: oppgave } = useOppgave();
  const canEdit = useCanEdit();
  const validationError = useValidationError('hjemmel');
  const lovKildeToRegistreringshjemler = useLovkildeToRegistreringshjemmelForYtelse(oppgave?.ytelseId ?? skipToken);

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
    [lovKildeToRegistreringshjemler],
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
        <Label size="small">Utfallet er basert på lovhjemmel</Label>
        <HelpText>
          Her setter du hjemlene som utfallet i saken er basert på. Hjemlene du setter her påvirker også hvilke gode
          formuleringer du kan sette inn i brevet, og hvilket regelverk som dukker opp i vedlegget nederst.
        </HelpText>
      </StyledHeaderHelpTextWrapper>
      <LovhjemmelSelect
        disabled={!canEdit || noHjemler}
        options={options}
        selected={oppgave.resultat.hjemmelIdSet}
        onChange={onLovhjemmelChange}
        error={validationError}
        showFjernAlle={false}
        show={canEdit}
      />
      <SelectedHjemlerList />
    </>
  );
};

const StyledHeaderHelpTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;
