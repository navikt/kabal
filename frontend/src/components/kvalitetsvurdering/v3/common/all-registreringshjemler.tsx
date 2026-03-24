import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo } from 'react';
import { useKvalitetsvurderingV3 } from '@/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { useValidationError } from '@/components/kvalitetsvurdering/v3/common/use-validation-error';
import { usePanelContainerRef } from '@/components/oppgavebehandling-panels/panel-container-ref-context';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useLovkildeToRegistreringshjemmelForYtelse } from '@/hooks/use-kodeverk-value';
import type {
  KvalitetsvurderingAllRegistreringshjemlerV3,
  KvalitetsvurderingV3Boolean,
} from '@/types/kaka-kvalitetsvurdering/v3';

const EMPTY_ARRAY: string[] = [];

interface HjemmelOption {
  id: string;
  navn: string;
  lovkildeNavn: string;
}

interface AllRegistreringshjemlerProps {
  field: keyof KvalitetsvurderingAllRegistreringshjemlerV3;
  parentKey?: keyof KvalitetsvurderingV3Boolean;
}

export const AllRegistreringshjemler = ({ field, parentKey }: AllRegistreringshjemlerProps) => {
  const containerRef = usePanelContainerRef();
  const { update, isLoading, kvalitetsvurdering } = useKvalitetsvurderingV3();
  const canEdit = useCanEditBehandling();
  const error = useValidationError(field);
  const { data: oppgave } = useOppgave();
  const lovKildeToRegistreringshjemler = useLovkildeToRegistreringshjemmelForYtelse(oppgave?.ytelseId ?? skipToken);

  const options = useMemo<Entry<HjemmelOption>[]>(
    () =>
      lovKildeToRegistreringshjemler.flatMap(({ lovkilde, registreringshjemler }) =>
        registreringshjemler.map(({ id, navn }) => ({
          value: { id, navn, lovkildeNavn: lovkilde.navn },
          key: id,
          label: (
            <span className="truncate">
              <span className="text-ax-text-neutral-subtle">{lovkilde.navn}</span>
              {' - '}
              {navn}
            </span>
          ),
          plainText: `${lovkilde.navn} - ${navn}`,
        })),
      ),
    [lovKildeToRegistreringshjemler],
  );

  const selected = isLoading ? EMPTY_ARRAY : (kvalitetsvurdering[field] ?? EMPTY_ARRAY);

  const value = useMemo(() => options.filter((entry) => selected.includes(entry.key)), [options, selected]);

  const handleChange = useCallback(
    (values: HjemmelOption[]) => {
      if (update === undefined) {
        return;
      }

      update({ [field]: values.map(({ id }) => id) });
    },
    [update, field],
  );

  if (isLoading) {
    return null;
  }

  const show = parentKey === undefined || kvalitetsvurdering[parentKey];

  if (!show) {
    return null;
  }

  return (
    <SearchableMultiSelect
      label="Velg hjemmel/hjemler"
      options={options}
      value={value}
      emptyLabel="Velg hjemler"
      onChange={handleChange}
      error={error}
      scrollContainerRef={containerRef}
      readOnly={!canEdit}
    />
  );
};
