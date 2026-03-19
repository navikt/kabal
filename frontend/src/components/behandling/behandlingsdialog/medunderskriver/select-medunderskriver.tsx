import { BodyShort } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  getTitleCapitalized,
  getTitleLowercase,
  getTitlePlural,
} from '@/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { MedunderskriverReadOnly } from '@/components/behandling/behandlingsdialog/medunderskriver/read-only';
import { SELECT_SKELETON } from '@/components/behandling/behandlingsdialog/medunderskriver/skeleton';
import { useSetMedunderskriver } from '@/components/oppgavestyring/use-set-medunderskriver';
import { SearchableNavEmployeeSelectWithLabel } from '@/components/searchable-select/searchable-single-select/searchable-nav-employee-select-with-label';
import { useHasRole } from '@/hooks/use-has-role';
import { useIsAssignedMedunderskriver, useIsAssignedMedunderskriverAndSent } from '@/hooks/use-is-medunderskriver';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useTildelSaksbehandlerMutation } from '@/redux-api/oppgaver/mutations/tildeling';
import { useGetPotentialMedunderskrivereQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { Role } from '@/types/bruker';
import type { SaksTypeEnum } from '@/types/kodeverk';
import { FlowState, type IMedunderskriverRol } from '@/types/oppgave-common';

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
      confirmLabel={`Send til ${getTitleLowercase(typeId)}`}
    />
  );
};
