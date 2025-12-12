import { FlatMultiSelectDropdown } from '@app/components/filter-dropdown/multi-select-dropdown';
import { NestedFilterList } from '@app/components/filter-dropdown/nested-filter-list';
import type { IOption } from '@app/components/filter-dropdown/props';
import { useKlageenheterOptions } from '@app/components/smart-editor-texts/hooks/use-options';
import { NONE, NONE_OPTION, type NONE_TYPE, SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { isUtfall } from '@app/functions/is-utfall';
import type { UtfallEnum } from '@app/types/kodeverk';
import { useCallback, useMemo } from 'react';
import { getTemplateOptions } from './get-template-options';

interface UtfallSelectProps {
  children: string;
  selected: string | undefined;
  onChange: (value: string[]) => void;
  options: IOption<UtfallEnum>[];
}

export const UtfallSelect = ({ children, selected, onChange, options }: UtfallSelectProps) => {
  const _options = useMemo(() => [NONE_OPTION, ...options], [options]);
  const _selected = useMemo(() => utfallQueryToSelected(selected), [selected]);
  const _onChange = useCallback(
    (value: (UtfallEnum | NONE_TYPE)[]) => {
      onChange(utfallValueToFilter(value));
    },
    [onChange],
  );

  return (
    <FlatMultiSelectDropdown options={_options} selected={_selected} onChange={_onChange} data-testid="filter-utfall">
      {children}
    </FlatMultiSelectDropdown>
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
  const options = includeNoneOption ? [NONE_OPTION, ...enheter] : enheter;

  return (
    <FlatMultiSelectDropdown options={options} selected={selected} onChange={onChange} data-testid="filter-klageenhet">
      {children}
    </FlatMultiSelectDropdown>
  );
};

interface TemplateSelectProps {
  children: string;
  selected: string[];
  onChange: (value: string[]) => void;
  includeNoneOption?: boolean;
  templatesSelectable?: boolean;
  includeDeprecated?: boolean;
}

export const TemplateSectionSelect = ({
  selected,
  children,
  onChange,
  includeNoneOption = false,
  templatesSelectable = false,
  includeDeprecated = false,
}: TemplateSelectProps) => {
  const templates = useMemo(
    () => getTemplateOptions(selected, includeNoneOption, includeDeprecated, templatesSelectable),
    [selected, includeNoneOption, includeDeprecated, templatesSelectable],
  );

  return (
    <NestedFilterList
      options={templates}
      selected={selected}
      onChange={onChange}
      data-testid="edit-text-template-select"
    >
      {children}
    </NestedFilterList>
  );
};
