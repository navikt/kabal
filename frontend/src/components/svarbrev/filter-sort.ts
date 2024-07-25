import { SortState } from '@navikt/ds-react';
import { fuzzySearch } from '@app/components/smart-editor/gode-formuleringer/fuzzy-search';
import { SplitQuery, splitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';
import { ALL_TYPES, ActiveEnum, TypeFilter } from '@app/components/svarbrev/filters';
import { SortDirection, SortKey } from '@app/components/svarbrev/use-search-params';
import { BehandlingstidUnitType, SvarbrevSetting } from '@app/types/svarbrev';

interface FilterSortFn {
  settings: NamedSvarbrevSetting[];
  ytelseFilter: string;
  textFilter: string;
  typeFilter: TypeFilter;
  activeFilter: ActiveEnum;
  sort: SortState | undefined;
}

export const filterSort = ({
  settings,
  ytelseFilter,
  textFilter,
  typeFilter,
  activeFilter,
  sort,
}: FilterSortFn): ScoredNamedSvarbrevSetting[] => {
  const filtered: ScoredNamedSvarbrevSetting[] = [];
  const filters: FilterFn[] = [];

  if (activeFilter !== ActiveEnum.ALL) {
    filters.push(getActiveFilter(activeFilter));
  }

  if (typeFilter !== ALL_TYPES) {
    filters.push(getTypeFilter(typeFilter));
  }

  const splitYtelseFilter = splitQuery(ytelseFilter);
  const splitTextFilter = splitQuery(textFilter);

  for (const s of settings) {
    if (!filters.every((f) => f(s))) {
      continue;
    }

    const scored = scoreFuntion(splitYtelseFilter, splitTextFilter, s);

    if (scored.ytelseScore === 0 || scored.textScore === 0) {
      continue;
    }

    filtered.push(scored);
  }

  if (sort === undefined) {
    return filtered.toSorted((a, b) => b.ytelseScore - a.ytelseScore);
  }

  return sorter(sort, filtered);
};

export interface NamedSvarbrevSetting extends SvarbrevSetting {
  ytelseName: string;
}

interface ScoredSvarbrevSetting extends SvarbrevSetting {
  ytelseScore: number;
  textScore: number;
}

export type ScoredNamedSvarbrevSetting = NamedSvarbrevSetting & ScoredSvarbrevSetting;

type FilterFn = (settings: SvarbrevSetting) => boolean;

const getActiveFilter =
  (activeFilter: ActiveEnum): FilterFn =>
  (setting) =>
    setting.shouldSend === (activeFilter === ActiveEnum.ACTIVE);

const getTypeFilter =
  (typeFilter: TypeFilter): FilterFn =>
  (setting) =>
    setting.typeId === typeFilter;

const scoreFuntion = (
  ytelseFilter: SplitQuery,
  textFilter: SplitQuery,
  setting: NamedSvarbrevSetting,
): ScoredSvarbrevSetting & NamedSvarbrevSetting => {
  const ytelseScore = ytelseFilter.maxScore === 0 ? 100 : fuzzySearch(ytelseFilter, setting.ytelseName);

  if (textFilter.maxScore === 0) {
    return { ...setting, ytelseScore, textScore: 100 };
  }

  const textScore =
    setting.customText === null || setting.customText.length === 0 ? 0 : fuzzySearch(textFilter, setting.customText);

  return { ...setting, ytelseScore, textScore };
};

const sorter = (sort: SortState, settings: ScoredNamedSvarbrevSetting[]): ScoredNamedSvarbrevSetting[] => {
  if (sort.direction === SortDirection.ASCENDING) {
    if (sort.orderBy === SortKey.YTELSE) {
      return settings.toSorted((a, b) => a.ytelseName.localeCompare(b.ytelseName));
    }

    if (sort.orderBy === SortKey.TIME) {
      return settings.toSorted(
        (a, b) =>
          a.behandlingstidUnits * (a.behandlingstidUnitTypeId === BehandlingstidUnitType.MONTHS ? 30 : 7) -
          b.behandlingstidUnits * (b.behandlingstidUnitTypeId === BehandlingstidUnitType.MONTHS ? 30 : 7),
      );
    }

    if (sort.orderBy === SortKey.MODIFIED) {
      return settings.toSorted((a, b) => a.modified.localeCompare(b.modified));
    }

    if (sort.orderBy === SortKey.YTELSE_SCORE) {
      return settings.toSorted((a, b) => a.ytelseScore - b.ytelseScore);
    }

    if (sort.orderBy === SortKey.TEXT_SCORE) {
      return settings.toSorted((a, b) => a.textScore - b.textScore);
    }
  }

  if (sort.orderBy === SortKey.YTELSE) {
    return settings.toSorted((a, b) => b.ytelseName.localeCompare(a.ytelseName));
  }

  if (sort.orderBy === SortKey.TIME) {
    return settings.toSorted(
      (a, b) =>
        b.behandlingstidUnits * (b.behandlingstidUnitTypeId === BehandlingstidUnitType.MONTHS ? 30 : 7) -
        a.behandlingstidUnits * (a.behandlingstidUnitTypeId === BehandlingstidUnitType.MONTHS ? 30 : 7),
    );
  }

  if (sort.orderBy === SortKey.MODIFIED) {
    return settings.toSorted((a, b) => b.modified.localeCompare(a.modified));
  }

  if (sort.orderBy === SortKey.YTELSE_SCORE) {
    return settings.toSorted((a, b) => b.ytelseScore - a.ytelseScore);
  }

  if (sort.orderBy === SortKey.TEXT_SCORE) {
    return settings.toSorted((a, b) => b.textScore - a.textScore);
  }

  return settings;
};
