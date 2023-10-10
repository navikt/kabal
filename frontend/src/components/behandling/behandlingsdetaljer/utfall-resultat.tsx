import { HelpText, Label, Select } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { isUtfall } from '@app/functions/is-utfall';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useUtfall } from '@app/hooks/use-utfall';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateUtfallMutation } from '@app/redux-api/oppgaver/mutations/set-utfall';
import { UtfallEnum } from '@app/types/kodeverk';

interface UtfallResultatProps {
  utfall: UtfallEnum | null;
  oppgaveId: string;
}

const NOT_SELECTED = 'NOT_SELECTED';
const ID = 'select-utfall';

export const UtfallResultat = ({ utfall, oppgaveId }: UtfallResultatProps) => {
  const [updateUtfall] = useUpdateUtfallMutation();
  const canEdit = useCanEdit();
  const validationError = useValidationError('utfall');
  const utfallLabel = useFieldName('utfall');
  const { data: oppgave } = useOppgave();

  const [utfallKodeverk, isLoading] = useUtfall(oppgave?.typeId);

  const onUtfallResultatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (typeof oppgaveId !== 'string') {
      return;
    }

    if (isUtfall(value)) {
      updateUtfall({ oppgaveId, utfall: value });
    } else if (value === NOT_SELECTED) {
      updateUtfall({ oppgaveId, utfall: null });
    }
  };

  const options = utfallKodeverk.map(({ id, navn }) => <option key={id} value={id} label={navn} />);

  return (
    <Container data-testid="utfall-section">
      <HelpTextWrapper>
        <Label size="small" htmlFor={ID}>
          {utfallLabel}
        </Label>
        <HelpText>Du kan kun velge ett utfall i saken. Velg det utfallet som passer best.</HelpText>
      </HelpTextWrapper>

      <Select
        disabled={!canEdit || isLoading}
        label={utfallLabel}
        hideLabel
        size="small"
        onChange={onUtfallResultatChange}
        value={utfall ?? undefined}
        id={ID}
        data-testid={ID}
        data-ready={!isLoading}
        error={validationError}
      >
        <option value={NOT_SELECTED} label="Ikke valgt" />
        {options}
      </Select>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const HelpTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
