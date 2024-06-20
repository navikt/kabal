import { SortState } from '@navikt/ds-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NamedSvarbrevSetting, ScoredNamedSvarbrevSetting, filterSort } from '@app/components/svarbrev/filter-sort';
import { ActiveEnum, TypeFilter } from '@app/components/svarbrev/filters';
import { useYtelserAll } from '@app/simple-api-state/use-kodeverk';
import { SvarbrevSetting } from '@app/types/svarbrev';

interface FilterSort {
  allSettings: SvarbrevSetting[] | undefined;
  ytelseFilter: string;
  textFilter: string;
  typeFilter: TypeFilter;
  activeFilter: ActiveEnum;
  sort: SortState | undefined;
}

interface Loading {
  sortedFilteredSettings: undefined;
  sortFilterIsLoading: true;
}

interface Ready {
  sortedFilteredSettings: ScoredNamedSvarbrevSetting[];
  sortFilterIsLoading: false;
}

type Result = Loading | Ready;

export const useFilterSort = ({
  allSettings,
  ytelseFilter,
  textFilter,
  typeFilter,
  activeFilter,
  sort,
}: FilterSort): Result => {
  const { data: ytelser, isLoading } = useYtelserAll();
  const isInitialized = useRef(false);

  const settings = useMemo(() => {
    if (isLoading || ytelser === undefined || allSettings === undefined) {
      return undefined;
    }

    return allSettings.map<NamedSvarbrevSetting>((s) => ({
      ...s,
      ytelseName: ytelser.find(({ id }) => id === s.ytelseId)?.navn ?? s.ytelseId,
    }));
  }, [isLoading, allSettings, ytelser]);

  const [result, setResults] = useState<ScoredNamedSvarbrevSetting[] | undefined>(undefined);

  useEffect(() => {
    if (settings === undefined) {
      return;
    }

    if (!isInitialized.current) {
      setResults(filterSort({ settings, ytelseFilter, textFilter, typeFilter, activeFilter, sort }));
      isInitialized.current = true;

      return;
    }

    const timout = setTimeout(
      () => setResults(filterSort({ settings, ytelseFilter, textFilter, typeFilter, activeFilter, sort })),
      300,
    );

    return () => clearTimeout(timout);
  }, [activeFilter, isInitialized, settings, sort, textFilter, typeFilter, ytelseFilter]);

  if (isLoading || result === undefined) {
    return { sortedFilteredSettings: undefined, sortFilterIsLoading: true };
  }

  return { sortedFilteredSettings: result, sortFilterIsLoading: false };
};
