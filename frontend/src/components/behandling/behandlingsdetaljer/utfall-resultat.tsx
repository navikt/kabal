import { Select } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isUtfall } from '../../../functions/is-utfall';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { useGetKodeverkQuery } from '../../../redux-api/kodeverk';
import { useUpdateUtfallMutation } from '../../../redux-api/oppgave';
import { StyledUtfallResultat } from '../styled-components';

interface UtfallResultatProps {
  utfall: string | null;
}

export const UtfallResultat = ({ utfall }: UtfallResultatProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const [updateUtfall] = useUpdateUtfallMutation();
  const canEdit = useCanEdit(klagebehandlingId);

  const { data: kodeverk, isLoading } = useGetKodeverkQuery();

  const onUtfallResultatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    updateUtfall({ klagebehandlingId, utfall: isUtfall(value) ? value : null });
  };

  if (typeof kodeverk === 'undefined' || isLoading) {
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
        selected={utfall ?? undefined}
      >
        <option value="">Ikke valgt</option>
        {options}
      </Select>
    </StyledUtfallResultat>
  );
};
