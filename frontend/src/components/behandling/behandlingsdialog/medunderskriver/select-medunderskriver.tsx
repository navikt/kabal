import { BodyShort, Select } from '@navikt/ds-react';
import React from 'react';
import { NONE } from '@app/components/behandling/behandlingsdialog/medunderskriver/constants';
import { SELECT_SKELETON } from '@app/components/behandling/behandlingsdialog/medunderskriver/skeleton';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useSetMedunderskriverMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver';
import { useGetPotentialMedunderskrivereQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IHelper } from '@app/types/oppgave-common';
import { getTitleCapitalized, getTitlePlural } from './get-title';
import { getFixedCacheKey } from './helpers';

interface Props {
  oppgaveId: string;
  medunderskriver: IHelper;
  typeId: SaksTypeEnum;
}

export const SelectMedunderskriver = ({ oppgaveId, medunderskriver, typeId }: Props) => {
  const { data } = useGetPotentialMedunderskrivereQuery(oppgaveId);
  const isSaksbehandler = useIsSaksbehandler();
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const [setMedunderskriver] = useSetMedunderskriverMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });

  const canChange = isSaksbehandler || hasOppgavestyringRole;

  if (!canChange) {
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
