import { BodyShort, Select } from '@navikt/ds-react';
import React from 'react';
import { NONE } from '@app/components/behandling/behandlingsdialog/medunderskriver/constants';
import { SELECT_SKELETON } from '@app/components/behandling/behandlingsdialog/medunderskriver/skeleton';
import { useSetMedunderskriverMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver';
import { useGetPotentialMedunderskrivereQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IHelper } from '@app/types/oppgave-common';
import { getTitleCapitalized, getTitlePlural } from './get-title';
import { getFixedCacheKey } from './helpers';
import { useCanChangeMedunderskriver } from './hooks';

interface Props {
  oppgaveId: string;
  medunderskriver: IHelper;
  typeId: SaksTypeEnum;
}

export const SelectMedunderskriver = ({ oppgaveId, medunderskriver, typeId }: Props) => {
  const { data } = useGetPotentialMedunderskrivereQuery(oppgaveId);
  const canChangeMedunderskriver = useCanChangeMedunderskriver();
  const [setMedunderskriver] = useSetMedunderskriverMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });

  if (!canChangeMedunderskriver) {
    return null;
  }

  if (typeof data === 'undefined') {
    return SELECT_SKELETON;
  }

  const { medunderskrivere } = data;

  if (medunderskrivere.length === 0) {
    return <BodyShort>Fant ingen {getTitlePlural(typeId)}</BodyShort>;
  }

  const onChange = (v: string) => setMedunderskriver({ oppgaveId, navIdent: v === NONE ? null : v });

  return (
    <Select
      size="small"
      label={`${getTitleCapitalized(typeId)}`}
      onChange={({ target }) => onChange(target.value)}
      value={medunderskriver.navIdent ?? NONE}
      data-testid="select-medunderskriver"
    >
      <option value={NONE}>Ingen</option>
      {medunderskrivere.map(({ navn, navIdent }) => (
        <option key={navIdent} value={navIdent}>
          {navn}
        </option>
      ))}
    </Select>
  );
};
