import { NestedFilterList, type NestedOption } from '@app/components/filter-dropdown/nested-filter-list';
import type { IOption } from '@app/components/filter-dropdown/props';
import { useKlageenheterOptions } from '@app/components/smart-editor-texts/hooks/use-options';
import { NONE, NONE_OPTION, type NONE_TYPE, SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { ToggleButton } from '@app/components/toggle-button/toggle-button';
import { isUtfall } from '@app/functions/is-utfall';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import type { UtfallEnum } from '@app/types/kodeverk';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
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
    <FilterDropdown options={_options} selected={_selected} onChange={_onChange} data-testid="filter-utfall">
      {children}
    </FilterDropdown>
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
const STYRINGSENHETEN = { value: '4200', label: 'Nav klageinstans styringsenhet' };

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
    <FilterDropdown options={options} selected={selected} onChange={onChange} data-testid="filter-klageenhet">
      {children}
    </FilterDropdown>
  );
};

interface TemplateSelectProps {
  children: string;
  selected: string[];
  onChange: (value: string[]) => void;
  includeNoneOption?: boolean;
  templatesSelectable?: boolean;
}

export const TemplateSectionSelect = ({
  selected,
  children,
  onChange,
  includeNoneOption = false,
  templatesSelectable = false,
}: TemplateSelectProps) => {
  const templates = useMemo(
    () => getTemplateOptions(includeNoneOption, templatesSelectable),
    [includeNoneOption, templatesSelectable],
  );

  return (
    <NestedDropDown options={templates} selected={selected} onChange={onChange} data-testid="edit-text-template-select">
      {children}
    </NestedDropDown>
  );
};

interface NestedDropDownProps {
  children: string;
  selected: string[];
  onChange: (value: string[]) => void;
  options: NestedOption[];
  'data-testid': string;
}

const NestedDropDown = ({ children, selected, onChange, options, 'data-testid': testId }: NestedDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative">
      <ToggleButton $open={isOpen} onClick={toggleOpen}>
        {children} ({selected.length})
      </ToggleButton>
      {isOpen ? (
        <NestedFilterList options={options} selected={selected} onChange={onChange} data-testid={testId} />
      ) : null}
    </div>
  );
};
