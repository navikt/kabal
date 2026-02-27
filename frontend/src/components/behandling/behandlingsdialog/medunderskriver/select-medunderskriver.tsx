import { MedunderskriverReadOnly } from '@app/components/behandling/behandlingsdialog/medunderskriver/read-only';
import { SELECT_SKELETON } from '@app/components/behandling/behandlingsdialog/medunderskriver/skeleton';
import { useSetMedunderskriver } from '@app/components/oppgavestyring/use-set-medunderskriver';
import { SearchableNavEmployeeSelectWithLabel } from '@app/components/searchable-select/searchable-nav-employee-select-with-label';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsAssignedMedunderskriver, useIsAssignedMedunderskriverAndSent } from '@app/hooks/use-is-medunderskriver';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useTildelSaksbehandlerMutation } from '@app/redux-api/oppgaver/mutations/tildeling';
import { useGetPotentialMedunderskrivereQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { Role } from '@app/types/bruker';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState, type IMedunderskriverRol } from '@app/types/oppgave-common';
import { BodyShort } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { getTitleCapitalized, getTitleLowercase, getTitlePlural } from './get-title';

interface Props {
  oppgaveId: string;
  medunderskriver: IMedunderskriverRol;
  typeId: SaksTypeEnum;
}

export const SelectMedunderskriver = ({ oppgaveId, medunderskriver, typeId }: Props) => {
  const [, { isLoading }] = useTildelSaksbehandlerMutation({ fixedCacheKey: oppgaveId });
  const isTildeltSaksbehandler = useIsTildeltSaksbehandler();
  const isTildeltMu = useIsAssignedMedunderskriver();
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const { data } = useGetPotentialMedunderskrivereQuery(
    (isTildeltSaksbehandler || isTildeltMu || hasOppgavestyringRole) && !isLoading ? oppgaveId : skipToken,
  );
  const { onChange, isUpdating } = useSetMedunderskriver(oppgaveId, data?.medunderskrivere);
  const isMedunderskriver = useIsAssignedMedunderskriverAndSent();

  const canChange =
    isTildeltSaksbehandler ||
    isMedunderskriver ||
    (hasOppgavestyringRole && medunderskriver.flowState === FlowState.SENT);

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

  const fromNavIdent = medunderskriver.employee?.navIdent ?? null;

  return (
    <SearchableNavEmployeeSelectWithLabel
      label={getTitleCapitalized(typeId)}
      onChange={(employee) => onChange(employee.navIdent, fromNavIdent)}
      onClear={() => onChange(null, fromNavIdent)}
      value={medunderskriver.employee}
      disabled={isUpdating}
      options={medunderskrivere}
      nullLabel="Ingen"
      confirmLabel={`Sett ${getTitleLowercase(typeId)}`}
    />
  );
};
