import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { differenceInMilliseconds, parseISO } from 'date-fns';
import { useMemo } from 'react';
import {
  getTitleCapitalized,
  getTitleLowercase,
  getTitlePlural,
} from '@/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { MedunderskriverReadOnly } from '@/components/behandling/behandlingsdialog/medunderskriver/read-only';
import { SELECT_SKELETON } from '@/components/behandling/behandlingsdialog/medunderskriver/skeleton';
import {
  typeHasKvalitetsvurdering,
  utfallHasKvalitetsvurdering,
} from '@/components/oppgavebehandling-controls/use-hide-kvalitetsvurdering';
import { useSetMedunderskriver } from '@/components/oppgavestyring/use-set-medunderskriver';
import { toNavEmployeeEntry } from '@/components/searchable-select/searchable-single-select/searchable-nav-employee-select';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useHasRole } from '@/hooks/use-has-role';
import { useIsAssignedMedunderskriver, useIsAssignedMedunderskriverAndSent } from '@/hooks/use-is-medunderskriver';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useKvalitetsvurdering } from '@/hooks/use-kvalitetsvurdering';
import { pushEvent } from '@/observability';
import { useTildelSaksbehandlerMutation } from '@/redux-api/oppgaver/mutations/tildeling';
import { useGetPotentialMedunderskrivereQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import type { INavEmployee } from '@/types/bruker';
import { Role } from '@/types/bruker';
import type { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';
import { FlowState, type IMedunderskriver } from '@/types/oppgave-common';

interface Props {
  id: string;
  typeId: SaksTypeEnum;
  utfallId: UtfallEnum | null;
  medunderskriver: IMedunderskriver;
}

const NONE_LABEL = 'Ingen';
const NONE_ENTRY: Entry<INavEmployee | null> = {
  value: null,
  key: '__none__',
  plainText: NONE_LABEL,
  label: NONE_LABEL,
};

export const SelectMedunderskriver = ({ id, typeId, utfallId, medunderskriver }: Props) => {
  const [, { isLoading }] = useTildelSaksbehandlerMutation({ fixedCacheKey: id });
  const isTildeltSaksbehandler = useIsTildeltSaksbehandler();
  const isTildeltMu = useIsAssignedMedunderskriver();
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const { data } = useGetPotentialMedunderskrivereQuery(
    (isTildeltSaksbehandler || isTildeltMu || hasOppgavestyringRole) && !isLoading ? id : skipToken,
  );
  const { onChange, isUpdating } = useSetMedunderskriver(id, data?.medunderskrivere);
  const isMedunderskriver = useIsAssignedMedunderskriverAndSent();

  const [kvalitetsvurdering] = useKvalitetsvurdering();

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
  const titleLabel = getTitleCapitalized(typeId);

  const handleChange = (employee: INavEmployee | null) => {
    if (
      typeHasKvalitetsvurdering(typeId) &&
      utfallHasKvalitetsvurdering(utfallId) &&
      medunderskriver.flowState === FlowState.NOT_SENT &&
      employee !== null &&
      kvalitetsvurdering !== undefined
    ) {
      const kvalitetsvurderingFilledOut = isModified(kvalitetsvurdering.created, kvalitetsvurdering.modified);
      pushEvent(kvalitetsvurderingFilledOut ? 'set-mu-after-kv' : 'set-mu-before-kv', 'kvalitetsvurdering', {
        oppgaveId: id,
      });
    }

    onChange(employee?.navIdent ?? null, fromNavIdent);
  };

  return (
    <SelectMedunderskriverInner
      label={titleLabel}
      medunderskrivere={medunderskrivere}
      employee={medunderskriver.employee}
      isUpdating={isUpdating}
      onChange={handleChange}
      confirmLabel={`Send til ${getTitleLowercase(typeId)}`}
    />
  );
};

interface SelectMedunderskriverInnerProps {
  label: string;
  medunderskrivere: INavEmployee[];
  employee: INavEmployee | null;
  isUpdating: boolean;
  onChange: (employee: INavEmployee | null) => void;
  confirmLabel: string;
}

const SelectMedunderskriverInner = ({
  label,
  medunderskrivere,
  employee,
  isUpdating,
  onChange,
  confirmLabel,
}: SelectMedunderskriverInnerProps) => {
  const options = useMemo(
    (): Entry<INavEmployee | null>[] => [NONE_ENTRY, ...medunderskrivere.map(toNavEmployeeEntry)],
    [medunderskrivere],
  );

  const selectedEntry = useMemo((): Entry<INavEmployee | null> => {
    if (employee === null) {
      return NONE_ENTRY;
    }

    return options.find((e) => e.key === employee.navIdent) ?? NONE_ENTRY;
  }, [employee, options]);

  return (
    <VStack gap="space-4">
      <Label size="small">{label}</Label>
      <SearchableSelect
        label={label}
        options={options}
        value={selectedEntry}
        onChange={onChange}
        loading={isUpdating}
        nullLabel={NONE_LABEL}
        confirmLabel={confirmLabel}
        requireConfirmation
      />
    </VStack>
  );
};

/**
 * TODO: Remove tolerance when all old kvalitetsvurderinger are done.
 *
 * Backend bug: `modified` can differ from `created` by a few ms on creation. Treat differences under 1 second as unmodified.
 */
const isModified = (created: string, modified: string): boolean =>
  Math.abs(differenceInMilliseconds(parseISO(modified), parseISO(created))) > 1_000;
