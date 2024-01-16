import { HelpText, Label } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateRegistreringshjemlerMutation } from '@app/redux-api/oppgaver/mutations/set-registreringshjemler';
import { LovhjemmelSelect } from './lovhjemmel-select';
import { SelectedHjemlerList } from './selected-hjemler-list';

const EMPTY_LIST: string[] = [];

export const Lovhjemmel = () => {
  const [updateHjemler] = useUpdateRegistreringshjemlerMutation();
  const { data: oppgave } = useOppgave();
  const canEdit = useCanEdit();
  const validationError = useValidationError('hjemmel');

  const selected = oppgave?.resultat.hjemmelIdSet ?? EMPTY_LIST;

  if (oppgave === undefined) {
    return null;
  }

  const onLovhjemmelChange = (hjemler: string[]) => {
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
        disabled={!canEdit}
        selected={oppgave.resultat.hjemmelIdSet}
        onChange={onLovhjemmelChange}
        error={validationError}
        showFjernAlle={false}
        show={canEdit}
      >
        Hjemmel
      </LovhjemmelSelect>
      <SelectedHjemlerList selected={selected} />
    </>
  );
};

const StyledHeaderHelpTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;
