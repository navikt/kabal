import { useKvalitetsvurderingV3 } from '@app/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { useValidationError } from '@app/components/kvalitetsvurdering/v3/common/use-validation-error';
import { usePanelContainerRef } from '@app/components/oppgavebehandling-panels/panel-container-ref-context';
import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useLovkildeToRegistreringshjemmelForYtelse } from '@app/hooks/use-kodeverk-value';
import type {
  KvalitetsvurderingAllRegistreringshjemlerV3,
  KvalitetsvurderingV3Boolean,
} from '@app/types/kaka-kvalitetsvurdering/v3';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo } from 'react';

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

  const options = useMemo<HjemmelOption[]>(
    () =>
      lovKildeToRegistreringshjemler.flatMap(({ lovkilde, registreringshjemler }) =>
        registreringshjemler.map(({ id, navn }) => ({
          id,
          navn,
          lovkildeNavn: lovkilde.navn,
        })),
      ),
    [lovKildeToRegistreringshjemler],
  );

  const selected = isLoading ? EMPTY_ARRAY : (kvalitetsvurdering[field] ?? EMPTY_ARRAY);

  const value = useMemo(() => options.filter(({ id }) => selected.includes(id)), [options, selected]);

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
      valueKey={hjemmelValueKey}
      formatOption={formatHjemmelOption}
      emptyLabel="Velg hjemler"
      filterText={hjemmelFilterText}
      onChange={handleChange}
      error={error}
      confirmLabel="Sett hjemler"
      scrollContainerRef={containerRef}
      readOnly={!canEdit}
    />
  );
};

const hjemmelValueKey = (option: HjemmelOption): string => option.id;

const formatHjemmelOption = (option: HjemmelOption) => (
  <span className="truncate">
    <span className="text-ax-text-neutral-subtle">{option.lovkildeNavn}</span>
    {' - '}
    {option.navn}
  </span>
);

const hjemmelFilterText = (option: HjemmelOption): string => `${option.lovkildeNavn} - ${option.navn}`;
