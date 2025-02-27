import { QueryKey, SortKey } from '@app/components/smart-editor-texts/sortable-header';
import { type Status, filterByStatus } from '@app/components/smart-editor-texts/status-filter/status-filter';
import { fuzzySearch } from '@app/components/smart-editor/gode-formuleringer/fuzzy-search';
import { splitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';
import { sortWithOrdinals } from '@app/functions/sort-with-ordinals/sort-with-ordinals';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { SortOrder } from '@app/types/sort';
import type { Language } from '@app/types/texts/language';
import type { ListText } from '@app/types/texts/responses';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type RedaktørItem = ListText | IMaltekstseksjon;
type ScoredText<T extends RedaktørItem> = T & {
  score: number;
};

export const useFilteredAndSorted = <T extends RedaktørItem>(
  data: T[],
  statusFilter: Status[],
  filter: string,
  getFilterText: (text: T, language: Language) => string,
  getModified: (text: T) => string,
) => {
  const order = useOrder();
  const sort = useSort();

  const filteredTexts = useFiltered(data, statusFilter, filter, getFilterText);

  const sortedTexts: ScoredText<T>[] = useMemo(
    () =>
      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
      filteredTexts.toSorted((a, b) => {
        const isAsc = order === SortOrder.ASC;

        switch (sort) {
          case SortKey.SCORE: {
            const diff = isAsc ? a.score - b.score : b.score - a.score;

            return diff === 0 ? sortWithOrdinals(a.title, b.title) : diff;
          }

          case SortKey.MODIFIED:
            return isAsc ? getModified(a).localeCompare(getModified(b)) : getModified(b).localeCompare(getModified(a));

          default:
            return isAsc ? sortWithOrdinals(a.title, b.title) : sortWithOrdinals(b.title, a.title);
        }
      }),
    [filteredTexts, order, sort, getModified],
  );

  return sortedTexts;
};

const useFiltered = <T extends RedaktørItem>(
  data: T[],
  statusFilter: Status[],
  filter: string,
  getFilterText: (text: T, language: Language) => string,
): ScoredText<T>[] => {
  const language = useRedaktoerLanguage();

  return useMemo(() => {
    const filteredByStatus = data.filter((t) => filterByStatus(statusFilter, t));

    if (filter.length === 0) {
      return filteredByStatus.map((text) => ({ ...text, score: 100 }));
    }

    const result: ScoredText<T>[] = [];

    for (const text of filteredByStatus) {
      const filterText = getFilterText(text, language);

      const score = fuzzySearch(splitQuery(filter), filterText);

      if (score > 0) {
        result.push({ ...text, score });
      }
    }

    return result;
  }, [data, filter, language, statusFilter, getFilterText]);
};

export const useSort = () => {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const param = searchParams.get(QueryKey.SORT);

    if (param === SortKey.MODIFIED) {
      return SortKey.MODIFIED;
    }

    if (param === SortKey.SCORE) {
      return SortKey.SCORE;
    }

    return SortKey.TITLE;
  }, [searchParams]);
};

export const useOrder = () => {
  const [searchParams] = useSearchParams();

  return useMemo(
    () => (searchParams.get(QueryKey.ORDER) !== SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC),
    [searchParams],
  );
};
