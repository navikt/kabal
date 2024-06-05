import { BodyShort, Select } from '@navikt/ds-react';
import { NONE } from '@app/components/behandling/behandlingsdialog/medunderskriver/constants';
import { MedunderskriverReadOnly } from '@app/components/behandling/behandlingsdialog/medunderskriver/read-only';
import { SELECT_SKELETON } from '@app/components/behandling/behandlingsdialog/medunderskriver/skeleton';
import { useSetMedunderskriver } from '@app/components/oppgavestyring/use-set-medunderskriver';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetPotentialMedunderskrivereQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState, IMedunderskriverRol } from '@app/types/oppgave-common';
import { getTitleCapitalized, getTitlePlural } from './get-title';

interface Props {
  oppgaveId: string;
  medunderskriver: IMedunderskriverRol;
  typeId: SaksTypeEnum;
}

export const SelectMedunderskriver = ({ oppgaveId, medunderskriver, typeId }: Props) => {
  const { data } = useGetPotentialMedunderskrivereQuery(oppgaveId);
  const isSaksbehandler = useIsSaksbehandler();
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const { onChange, isUpdating } = useSetMedunderskriver(oppgaveId, data?.medunderskrivere);

  const canChange = isSaksbehandler || (hasOppgavestyringRole && medunderskriver.flowState === FlowState.SENT);

  if (!canChange) {
    return <MedunderskriverReadOnly medunderskriver={medunderskriver} typeId={typeId} />;
  }

  if (typeof data === 'undefined') {
    return SELECT_SKELETON;
  }

  const { medunderskrivere } = data;

  if (medunderskrivere.length === 0) {
    return <BodyShort>Fant ingen {getTitlePlural(typeId)}</BodyShort>;
  }

  return (
    <Select
      size="small"
      label={`${getTitleCapitalized(typeId)}`}
      onChange={({ target }) =>
        onChange(target.value === NONE ? null : target.value, medunderskriver.employee?.navIdent ?? null)
      }
      value={medunderskriver.employee?.navIdent ?? NONE}
      data-testid="select-medunderskriver"
      disabled={isUpdating}
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
