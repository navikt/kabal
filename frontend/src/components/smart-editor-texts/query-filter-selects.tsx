import React, { useCallback, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { NestedFilterList, NestedOption } from '@app/components/filter-dropdown/nested-filter-list';
import { IOption } from '@app/components/filter-dropdown/props';
import { NONE, NONE_OPTION, NONE_TYPE, SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { ToggleButton } from '@app/components/toggle-button/toggle-button';
import { isUtfall } from '@app/functions/is-utfall';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { SectionType } from '@app/hooks/use-template-sections';
import { useTemplates } from '@app/hooks/use-templates';
import {
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_REDIGERBAR_MALTEKST,
} from '@app/plate/plugins/element-types';
import { RichTextTypes } from '@app/types/common-text-types';
import { UtfallEnum } from '@app/types/kodeverk';
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
  options: IOption<string>[];
}

export const KlageenhetSelect = ({ children, selected, onChange, options }: KlageenhetSelectProps) => (
  <FilterDropdown options={options} selected={selected} onChange={onChange} data-testid="filter-klageenhet">
    {children}
  </FilterDropdown>
);

interface TemplateSelectProps {
  children: string;
  selected: string[];
  onChange: (value: string[]) => void;
  textType:
    | RichTextTypes.MALTEKST
    | RichTextTypes.REDIGERBAR_MALTEKST
    | RichTextTypes.GOD_FORMULERING
    | RichTextTypes.MALTEKSTSEKSJON;
  includeNoneOption?: boolean;
  templatesSelectable?: boolean;
}

export const TemplateSectionSelect = ({
  selected,
  children,
  onChange,
  textType,
  includeNoneOption = false,
  templatesSelectable = false,
}: TemplateSelectProps) => {
  const sectionType: SectionType = useMemo(() => {
    switch (textType) {
      case RichTextTypes.MALTEKSTSEKSJON:
        return ELEMENT_MALTEKSTSEKSJON;
      case RichTextTypes.MALTEKST:
        return ELEMENT_MALTEKST;
      case RichTextTypes.REDIGERBAR_MALTEKST:
        return ELEMENT_REDIGERBAR_MALTEKST;
      case RichTextTypes.GOD_FORMULERING:
        return ELEMENT_MALTEKSTSEKSJON;
    }
  }, [textType]);

  const allTemplates = useTemplates();

  const templates = useMemo(
    () => getTemplateOptions(sectionType, includeNoneOption, templatesSelectable, allTemplates.templates),
    [allTemplates.templates, includeNoneOption, sectionType, templatesSelectable],
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
    <Container ref={ref}>
      <ToggleButton $open={isOpen} onClick={toggleOpen}>
        {children} ({selected.length})
      </ToggleButton>
      {isOpen ? (
        <NestedFilterList options={options} selected={selected} onChange={onChange} data-testid={testId} />
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;
