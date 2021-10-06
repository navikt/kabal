import { Select } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { useGetKodeverkQuery } from '../../../redux-api/kodeverk';
import { useUpdateUtfallMutation } from '../../../redux-api/oppgave';
import { Utfall } from '../../../redux-api/oppgave-state-types';
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
    const changedUtfall = event.target.value as keyof typeof Utfall;

    if (changedUtfall !== undefined) {
      updateUtfall({ klagebehandlingId, utfall: changedUtfall as Utfall });
    }
  };

  if (typeof kodeverk === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const options = kodeverk.utfall.map(({ id, navn }) => (
    <option key={id} value={id}>
      {navn}
    </option>
  ));

  const selected = utfall === null ? undefined : utfall;

  return (
    <StyledUtfallResultat>
      <Select
        disabled={!canEdit}
        label="Utfall/resultat:"
        bredde="s"
        onChange={onUtfallResultatChange}
        selected={selected}
      >
        {options}
      </Select>
    </StyledUtfallResultat>
  );
};
