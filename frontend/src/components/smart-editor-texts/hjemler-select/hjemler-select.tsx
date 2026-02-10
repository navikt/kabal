import { NestedFilterList, type NestedOption, OptionType } from '@app/components/filter-dropdown/nested-filter-list';
import { isIndeterminate } from '@app/components/smart-editor-texts/hjemler-select/is-indeterminate';
import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';
import { useKabalYtelserLatest } from '@app/simple-api-state/use-kodeverk';
import { useMemo } from 'react';
import { COMMON_HJEMMEL_THRESHOLD, createHjemmelValue, useCounts, useGenerelleHjemler, useNoneOption } from './hooks';

interface HjemlerSelectProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  includeNoneOption?: boolean;
}

export const HjemlerSelect = ({ selected, onChange, includeNoneOption = false }: HjemlerSelectProps) => {
  const { data: ytelser = [] } = useKabalYtelserLatest();
  const generelleHjemler = useGenerelleHjemler();
  const { hjemlerCount } = useCounts(selected);

  const isGlobalSelected = selected.includes(GLOBAL);

  const ytelseOptions: NestedOption[] = useMemo(
    () =>
      ytelser
        .map<NestedOption>(({ id: ytelseId, navn: ytelsenavn, lovKildeToRegistreringshjemler }) => {
          const indeterminate =
            !selected.includes(ytelseId) &&
            (isGlobalSelected ||
              lovKildeToRegistreringshjemler.some(({ registreringshjemler }) =>
                registreringshjemler.some(
                  (h) =>
                    selected.includes(createHjemmelValue(ytelseId, h.id)) || isIndeterminate(selected, h.id, ytelseId),
                ),
              ));

          return {
            type: OptionType.GROUP,
            label: ytelsenavn,
            value: ytelseId,
            indeterminate,
            filterValue: ytelsenavn,
            options: lovKildeToRegistreringshjemler.map<NestedOption>(({ id, navn, registreringshjemler }) => ({
              type: OptionType.GROUP,
              label: navn,
              value: `${ytelseId}${LIST_DELIMITER}${id}`,
              filterValue: `${ytelsenavn} ${navn}`,
              options: registreringshjemler.map<NestedOption>((h) => ({
                type: OptionType.OPTION,
                value: createHjemmelValue(ytelseId, h.id),
                indeterminate: isIndeterminate(selected, h.id, ytelseId),
                label: h.navn,
                filterValue: `${ytelsenavn} ${navn} ${h.navn}`,
              })),
            })),
          };
        })
        .concat({
          type: OptionType.GROUP,
          label: `Hjemler felles for minst ${COMMON_HJEMMEL_THRESHOLD} ytelser`,
          value: GLOBAL,
          filterValue: GLOBAL,
          options: generelleHjemler,
        }),
    [generelleHjemler, isGlobalSelected, selected, ytelser],
  );

  const options = useNoneOption(ytelseOptions, includeNoneOption);

  const label = `Hjemler (${hjemlerCount})`;

  return (
    <NestedFilterList options={options} selected={selected} onChange={onChange}>
      {label}
    </NestedFilterList>
  );
};
