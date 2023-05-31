import { Select } from '@navikt/ds-react';
import React from 'react';
import { isUtfall } from '@app/functions/is-utfall';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useUtfall } from '@app/hooks/use-utfall';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateUtfallMutation } from '@app/redux-api/oppgaver/mutations/set-utfall';
import { StyledUtfallResultat } from '../styled-components';

interface UtfallResultatProps {
  utfall: string | null;
}

const NOT_SELECTED = 'NOT_SELECTED';

export const UtfallResultat = ({ utfall }: UtfallResultatProps) => {
  const oppgaveId = useOppgaveId();
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
    <StyledUtfallResultat data-testid="utfall-section">
      <Select
        disabled={!canEdit || isLoading}
        label={`${utfallLabel}:`}
        size="small"
        onChange={onUtfallResultatChange}
        value={utfall ?? undefined}
        data-testid="select-utfall"
        data-ready={!isLoading}
        error={validationError}
      >
        <option value={NOT_SELECTED} label="Ikke valgt" />
        {options}
      </Select>
    </StyledUtfallResultat>
  );
};
