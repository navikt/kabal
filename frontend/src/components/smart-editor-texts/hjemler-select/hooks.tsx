import { type NestedOption, OptionType } from '@app/components/filter-dropdown/nested-filter-list';
import { GLOBAL, LIST_DELIMITER, NONE, NONE_OPTION, WILDCARD } from '@app/components/smart-editor-texts/types';
import { useKabalYtelserLatest } from '@app/simple-api-state/use-kodeverk';
import type { IKodeverkSimpleValue } from '@app/types/kodeverk';
import { Tag } from '@navikt/ds-react';
import { useMemo } from 'react';

export const COMMON_HJEMMEL_THRESHOLD = 2;

const GLOBAL_PREFIX = `${GLOBAL}${LIST_DELIMITER}`;
const WILDCARD_SUFFIX = `${LIST_DELIMITER}${WILDCARD}`;

export const getCounts = (selected: string[]) => {
  let ytelserCount = 0;
  let hjemlerCount = 0;

  for (const item of selected) {
    if (item === NONE) {
      continue;
    }

    if (item.startsWith(GLOBAL_PREFIX)) {
      hjemlerCount++;
    } else if (item.endsWith(WILDCARD_SUFFIX)) {
      ytelserCount++;
    } else if (item.includes(LIST_DELIMITER)) {
      hjemlerCount++;
    } else if (!item.startsWith(GLOBAL)) {
      ytelserCount++;
    }
  }

  return { ytelserCount, hjemlerCount };
};

export const useCounts = (selected: string[]) => useMemo(() => getCounts(selected), [selected]);

/** Create a NestedOption for a hjemmel that appears in multiple ytelser. */
const createCommonHjemmelOption = (
  hjemmel: IKodeverkSimpleValue,
  lovkildeNavn: string,
  count: number,
): NestedOption => ({
  type: OptionType.OPTION,
  value: `${GLOBAL}${LIST_DELIMITER}${hjemmel.id}`,
  label: hjemmel.navn,
  tags: [
    <Tag data-color="info" size="xsmall" variant="strong" key={hjemmel.id}>
      {`${count} ytelser`}
    </Tag>,
  ],
  filterValue: `${lovkildeNavn} ${hjemmel.navn}`,
});

interface LovkildeGroup {
  lovkildeNavn: string;
  hjemler: Map<string, IKodeverkSimpleValue>;
}

export const useGenerelleHjemler = () => {
  const { data: ytelser = [] } = useKabalYtelserLatest();

  return useMemo(() => {
    const hjemmelCounts = new Map<string, number>();
    const lovkildeGroups = new Map<string, LovkildeGroup>();

    for (const { lovKildeToRegistreringshjemler } of ytelser) {
      for (const { navn, id, registreringshjemler } of lovKildeToRegistreringshjemler) {
        for (const hjemmel of registreringshjemler) {
          hjemmelCounts.set(hjemmel.id, (hjemmelCounts.get(hjemmel.id) ?? 0) + 1);

          const group = lovkildeGroups.get(id);

          if (group === undefined) {
            lovkildeGroups.set(id, { lovkildeNavn: navn, hjemler: new Map([[hjemmel.id, hjemmel]]) });
          } else {
            group.hjemler.set(hjemmel.id, hjemmel);
          }
        }
      }
    }

    const result: NestedOption[] = [];

    for (const [lovkildeId, { lovkildeNavn, hjemler }] of lovkildeGroups) {
      const hjemmelOptions: NestedOption[] = [];

      for (const hjemmel of hjemler.values()) {
        const count = hjemmelCounts.get(hjemmel.id) ?? 0;

        if (count >= COMMON_HJEMMEL_THRESHOLD) {
          hjemmelOptions.push(createCommonHjemmelOption(hjemmel, lovkildeNavn, count));
        }
      }

      if (hjemmelOptions.length > 0) {
        const globalLovkildeId = `${GLOBAL}${LIST_DELIMITER}${lovkildeId}`;

        result.push({
          type: OptionType.GROUP,
          label: lovkildeNavn,
          value: globalLovkildeId,
          filterValue: lovkildeNavn,
          options: hjemmelOptions,
        });
      }
    }

    return result;
  }, [ytelser]);
};

export const useNoneOption = (ytelseOptions: NestedOption[], includeNoneOption: boolean) =>
  useMemo(
    () =>
      includeNoneOption
        ? [{ ...NONE_OPTION, filterValue: NONE_OPTION.value, type: OptionType.OPTION }, ...ytelseOptions]
        : ytelseOptions,
    [includeNoneOption, ytelseOptions],
  );

export const createHjemmelValue = (ytelseId: string, hjemmelId: string) => `${ytelseId}${LIST_DELIMITER}${hjemmelId}`;
