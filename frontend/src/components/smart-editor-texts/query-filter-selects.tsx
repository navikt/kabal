import { useCallback, useMemo } from 'react';
import { NestedFilterList } from '@/components/filter-dropdown/nested-filter-list';
import type { IOption } from '@/components/filter-dropdown/props';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { getTemplateOptions } from '@/components/smart-editor-texts/get-template-options';
import { useKlageenheterOptions } from '@/components/smart-editor-texts/hooks/use-options';
import {
  GLOBAL,
  LIST_DELIMITER,
  NONE,
  NONE_OPTION,
  type NONE_TYPE,
  SET_DELIMITER,
  WILDCARD,
} from '@/components/smart-editor-texts/types';
import { isUtfall } from '@/functions/is-utfall';
import type { UtfallEnum } from '@/types/kodeverk';

interface UtfallSelectProps {
  children: string;
  selected: string | undefined;
  onChange: (value: string[]) => void;
  options: IOption<UtfallEnum>[];
}

export const UtfallSelect = ({ children, selected, onChange, options }: UtfallSelectProps) => {
  const allOptions = useMemo(() => [NONE_OPTION, ...options], [options]);
  const selectedKeys = useMemo(() => utfallQueryToSelected(selected), [selected]);

  const selectedOptions = useMemo(
    () => allOptions.filter((o) => selectedKeys.includes(o.value)),
    [allOptions, selectedKeys],
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
      options={allOptions}
      value={selectedOptions}
      valueKey={getOptionValue}
      formatOption={getOptionLabel}
      emptyLabel={children}
      filterText={getOptionLabel}
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

interface KlageenhetSelectProps {
  children: string;
  selected: string[];
  onChange: (value: string[]) => void;
  includeNoneOption?: boolean;
}

// Styringsenheten er ikke en klageenhet.
// De må likevel være med i listen man kan velge fra når man legger inn topp- og bunntekster.
// Dette er fordi de er med i et pilotprosjekt hvor det kan forekomme at de selv må saksbehandle.
const STYRINGSENHETEN = { value: '4200', label: 'Klageinstans styringsenhet' };

export const KlageenhetSelect = ({
  children,
  selected,
  onChange,
  includeNoneOption = false,
}: KlageenhetSelectProps) => {
  const klageenheter = useKlageenheterOptions();
  const enheter = [...klageenheter, STYRINGSENHETEN];
  const options: IOption<string>[] = includeNoneOption ? [NONE_OPTION, ...enheter] : enheter;

  const selectedOptions = useMemo(() => options.filter((o) => selected.includes(o.value)), [options, selected]);

  const handleChange = useCallback(
    (values: IOption<string>[]) => {
      onChange(values.map((v) => v.value));
    },
    [onChange],
  );

  return (
    <SearchableMultiSelect
      label={children}
      options={options}
      value={selectedOptions}
      valueKey={getOptionValue}
      formatOption={getOptionLabel}
      emptyLabel={children}
      filterText={getOptionLabel}
      onChange={handleChange}
      triggerSize="small"
      triggerVariant="tertiary"
      showSelectAll
    />
  );
};

interface TemplateSectionSelectProps {
  selected: string[];
  onChange: (value: string[]) => void;
  includeNoneOption?: boolean;
  includeDeprecated?: boolean;
}

const useCounts = (selected: string[]) =>
  useMemo(() => {
    let templatesCount = 0;
    let sectionsCount = 0;

    for (const item of selected) {
      if (item === NONE) {
        continue;
      }
      if (item === GLOBAL || item.endsWith(`${LIST_DELIMITER}${WILDCARD}`)) {
        templatesCount++;
      } else if (item.includes(LIST_DELIMITER)) {
        sectionsCount++;
      }
    }

    return { templatesCount, sectionsCount };
  }, [selected]);

export const TemplateSectionSelect = ({
  selected,
  onChange,
  includeNoneOption = false,
  includeDeprecated = false,
}: TemplateSectionSelectProps) => {
  const templates = useMemo(
    () => getTemplateOptions(selected, includeNoneOption, includeDeprecated, true),
    [selected, includeNoneOption, includeDeprecated],
  );

  const { templatesCount, sectionsCount } = useCounts(selected);

  const label = `Maler (${templatesCount}) og seksjoner (${sectionsCount})`;

  return (
    <NestedFilterList options={templates} selected={selected} onChange={onChange}>
      {label}
    </NestedFilterList>
  );
};

const getOptionValue = (option: IOption<string>): string => option.value;
const getOptionLabel = (option: IOption<string>): string => option.label;

export const SectionSelect = ({
  selected,
  onChange,
  includeNoneOption = false,
  includeDeprecated = false,
}: TemplateSectionSelectProps) => {
  const templates = useMemo(
    () => getTemplateOptions(selected, includeNoneOption, includeDeprecated, false),
    [selected, includeNoneOption, includeDeprecated],
  );

  const { sectionsCount } = useCounts(selected);

  const label = `Seksjoner (${sectionsCount})`;

  return (
    <NestedFilterList options={templates} selected={selected} onChange={onChange}>
      {label}
    </NestedFilterList>
  );
};
