import { Select } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isUtfall } from '../../../functions/is-utfall';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useGetKodeverkQuery } from '../../../redux-api/kodeverk';
import { useUpdateUtfallMutation } from '../../../redux-api/oppgave';
import { StyledUtfallResultat } from '../styled-components';

interface UtfallResultatProps {
  utfall: string | null;
}

export const UtfallResultat = ({ utfall }: UtfallResultatProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const [updateUtfall] = useUpdateUtfallMutation();
  const canEdit = useCanEdit();
  const validationError = useValidationError('utfall');

  const { data: kodeverk, isLoading: isKodeverkLoading } = useGetKodeverkQuery();

  const onUtfallResultatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    updateUtfall({ klagebehandlingId, utfall: isUtfall(value) ? value : null });
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
        label="Utfall/resultat:"
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
