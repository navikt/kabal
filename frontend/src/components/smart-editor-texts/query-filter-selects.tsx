import { useCallback, useMemo } from 'react';
import { NestedFilterList, type NestedOption } from '@/components/filter-dropdown/nested-filter-list';
import type { IOption } from '@/components/filter-dropdown/props';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { getTemplateOptions } from '@/components/smart-editor-texts/get-template-options';
import {
  LIST_DELIMITER,
  NONE,
  NONE_OPTION,
  type NONE_TYPE,
  SET_DELIMITER,
  WILDCARD,
} from '@/components/smart-editor-texts/types';
import { isUtfall } from '@/functions/is-utfall';
import type { UtfallEnum } from '@/types/kodeverk';

const toEntry = <T extends string>(option: IOption<T>): Entry<IOption<T>> => ({
  value: option,
  key: option.value,
  label: option.label,
  plainText: option.label,
});

interface UtfallSelectProps {
  children: string;
  selected: string | undefined;
  onChange: (value: string[]) => void;
  options: IOption<UtfallEnum>[];
}

export const UtfallSelect = ({ children, selected, onChange, options }: UtfallSelectProps) => {
  const allEntries = useMemo<Entry<IOption<UtfallEnum | NONE_TYPE>>[]>(
    () => [toEntry(NONE_OPTION), ...options.map(toEntry)],
    [options],
  );
  const selectedKeys = useMemo(() => utfallQueryToSelected(selected), [selected]);

  const selectedEntries = useMemo(
    () => allEntries.filter((e) => selectedKeys.includes(e.value.value)),
    [allEntries, selectedKeys],
  );

  const handleChange = useCallback(
    (values: IOption<UtfallEnum | NONE_TYPE>[]) => {
      onChange(utfallValueToFilter(values.map((v) => v.value)));
    },
    [onChange],
  );

  return (
    <SearchableMultiSelect
      label={children}
      options={allEntries}
      value={selectedEntries}
      emptyLabel={children}
      onChange={handleChange}
      triggerSize="small"
      triggerVariant="tertiary"
      showSelectAll
    />
  );
};

const isUtfallOrNone = (value: string): value is UtfallEnum | NONE_TYPE => value === NONE || isUtfall(value);

const utfallQueryToSelected = (utfall: string | undefined): (UtfallEnum | NONE_TYPE)[] => {
  if (utfall === undefined) {
    return [];
  }

  const utfallSet = utfall.split(',').flatMap((set) => set.split(SET_DELIMITER).filter(isUtfallOrNone));

  if (utfallSet.length === 0) {
    return [NONE];
  }

  return utfallSet;
};

const utfallValueToFilter = (value: (UtfallEnum | NONE_TYPE)[]): string[] => {
  const utfall: UtfallEnum[] = [];
  let hasNone = false;

  for (const v of value) {
    if (v === NONE) {
      hasNone = true;
    } else {
      utfall.push(v);
    }
  }

  if (utfall.length === 0) {
    return hasNone ? [NONE] : [];
  }

  const utfallSet = utfall.sort().join(SET_DELIMITER);

  return hasNone ? [utfallSet, NONE] : [utfallSet];
};

interface TemplateSectionSelectProps {
  selected: string[];
  onChange: (value: string[]) => void;
  includeNoneOption?: boolean;
  includeDeprecated?: boolean;
}

const useFilterCounts = (selected: string[]) =>
  useMemo(() => {
    let templatesCount = 0;
    let sectionsCount = 0;

    for (const item of selected) {
      if (item === NONE) {
        continue;
      }
      if (item === WILDCARD || item.endsWith(`${LIST_DELIMITER}${WILDCARD}`)) {
        templatesCount++;
      } else if (item.includes(LIST_DELIMITER)) {
        sectionsCount++;
      }
    }

    return { templatesCount, sectionsCount };
  }, [selected]);

export const TemplateSectionFilter = ({
  selected,
  onChange,
  includeNoneOption = false,
  includeDeprecated = false,
}: TemplateSectionSelectProps) => {
  const templates = useMemo(
    () => getTemplateOptions(selected, includeNoneOption, includeDeprecated, true, WILDCARD),
    [selected, includeNoneOption, includeDeprecated],
  );

  const { templatesCount, sectionsCount } = useFilterCounts(selected);

  const label = `Maler (${templatesCount}) og seksjoner (${sectionsCount})`;

  return (
    <NestedFilterList options={templates} selected={selected} onChange={onChange}>
      {label}
    </NestedFilterList>
  );
};

interface SectionSelectProps {
  selected: string[];
  onChange: (value: string[]) => void;
  nestedOptions: NestedOption[];
  sectionsCount: number;
}

export const SectionSelect = ({ selected, onChange, nestedOptions, sectionsCount }: SectionSelectProps) => {
  const label = `Seksjoner (${sectionsCount})`;

  return (
    <NestedFilterList options={nestedOptions} selected={selected} onChange={onChange}>
      {label}
    </NestedFilterList>
  );
};
