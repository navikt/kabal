import { Select } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isUtfall } from '../../../functions/is-utfall';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useUpdateUtfall } from '../../../hooks/oppgavebehandling/use-update-utfall';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useFieldName } from '../../../hooks/use-field-name';
import { useUtfall } from '../../../hooks/use-utfall';
import { useValidationError } from '../../../hooks/use-validation-error';
import { StyledUtfallResultat } from '../styled-components';

interface UtfallResultatProps {
  utfall: string | null;
}

const NOT_SELECTED = 'NOT_SELECTED';

export const UtfallResultat = ({ utfall }: UtfallResultatProps) => {
  const oppgaveId = useOppgaveId();
  const [updateUtfall] = useUpdateUtfall();
  const canEdit = useCanEdit();
  const validationError = useValidationError('utfall');
  const utfallLabel = useFieldName('utfall');
  const { data: oppgave } = useOppgave();

  const utfallKodeverk = useUtfall(oppgave?.type);

  const onUtfallResultatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (isUtfall(value)) {
      updateUtfall({ oppgaveId, utfall: value });
    } else if (value === NOT_SELECTED) {
      updateUtfall({ oppgaveId, utfall: null });
    }
  };

  if (typeof utfallKodeverk === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const options = utfallKodeverk.map(({ id, navn }) => (
    <option key={id} value={id}>
      {navn}
    </option>
  ));

  return (
    <StyledUtfallResultat>
      <Select
        disabled={!canEdit}
        label={`${utfallLabel}:`}
        bredde="s"
        onChange={onUtfallResultatChange}
        value={utfall ?? undefined}
        data-testid="select-utfall"
        feil={validationError}
      >
        <option value={NOT_SELECTED}>Ikke valgt</option>
        {options}
      </Select>
    </StyledUtfallResultat>
  );
};
