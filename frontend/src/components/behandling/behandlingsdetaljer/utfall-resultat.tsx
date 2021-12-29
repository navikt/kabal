import { Select } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isUtfall } from '../../../functions/is-utfall';
import { useUpdateUtfall } from '../../../hooks/oppgavebehandling/use-update-utfall';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useFieldName } from '../../../hooks/use-field-name';
import { useOppgaveId } from '../../../hooks/use-oppgave-id';
import { useOppgaveType } from '../../../hooks/use-oppgave-type';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useGetKodeverkQuery } from '../../../redux-api/kodeverk';
import { StyledUtfallResultat } from '../styled-components';

interface UtfallResultatProps {
  utfall: string | null;
}

export const UtfallResultat = ({ utfall }: UtfallResultatProps) => {
  const oppgaveId = useOppgaveId();
  const [updateUtfall] = useUpdateUtfall();
  const canEdit = useCanEdit();
  const validationError = useValidationError('utfall');
  const utfallLabel = useFieldName('utfall');
  const type = useOppgaveType();

  const { data: kodeverk, isLoading: isKodeverkLoading } = useGetKodeverkQuery(type);

  const onUtfallResultatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    updateUtfall({ oppgaveId, type, utfall: isUtfall(value) ? value : null });
  };

  if (typeof kodeverk === 'undefined' || isKodeverkLoading) {
    return <NavFrontendSpinner />;
  }

  const options = kodeverk.utfall.map(({ id, navn }) => (
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
        <option value="">Ikke valgt</option>
        {options}
      </Select>
    </StyledUtfallResultat>
  );
};
