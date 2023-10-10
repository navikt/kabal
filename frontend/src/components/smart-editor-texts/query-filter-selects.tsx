/* eslint-disable max-lines */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { NestedFilterList, NestedOption, OptionType } from '@app/components/filter-dropdown/nested-filter-list';
import { IOption } from '@app/components/filter-dropdown/props';
import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import {
  GLOBAL,
  LIST_DELIMITER,
  NONE,
  NONE_OPTION,
  NONE_TYPE,
  SET_DELIMITER,
  WILDCARD,
} from '@app/components/smart-editor-texts/types';
import { ToggleButton } from '@app/components/toggle-button/toggle-button';
import { isUtfall } from '@app/functions/is-utfall';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { SectionType, getTemplateSections } from '@app/hooks/use-template-sections';
import { ELEMENT_MALTEKST, ELEMENT_REDIGERBAR_MALTEKST } from '@app/plate/plugins/element-types';
import { TemplateSections } from '@app/plate/template-sections';
import { TEMPLATES } from '@app/plate/templates/templates';
import { UtfallEnum } from '@app/types/kodeverk';
import { RichTextTypes } from '@app/types/texts/texts';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';

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
  textType: RichTextTypes.MALTEKST | RichTextTypes.REDIGERBAR_MALTEKST | RichTextTypes.GOD_FORMULERING;
  includeNoneOption?: boolean;
  templatesSelectable?: boolean;
}

export const ALL_TEMPLATES_LABEL = 'Alle maler';

const getTemplateOptions = (
  sectionType: SectionType,
  includeNone: boolean,
  templatesSelectable: boolean,
): NestedOption[] => {
  const isMaltekst = sectionType === ELEMENT_MALTEKST || sectionType === ELEMENT_REDIGERBAR_MALTEKST;

  const options: NestedOption[] = [];

  for (const { templateId, tittel } of TEMPLATES) {
    const sections = getTemplateSections(templateId, sectionType);

    if (isMaltekst && sections.length === 0) {
      continue;
    }

    options.push({
      type: templatesSelectable ? OptionType.OPTION : OptionType.GROUP,
      label: tittel,
      value: `${templateId}${LIST_DELIMITER}${WILDCARD}`,
      filterValue: templateId,
      options: sections.map((s) => ({
        type: OptionType.OPTION,
        value: `${templateId}${LIST_DELIMITER}${s}`,
        label: MALTEKST_SECTION_NAMES[s],
        filterValue: `${tittel} ${MALTEKST_SECTION_NAMES[s]}`,
      })),
    });
  }

  options.push({
    type: templatesSelectable ? OptionType.OPTION : OptionType.GROUP,
    label: ALL_TEMPLATES_LABEL,
    value: GLOBAL,
    filterValue: '',
    options: Object.values(TemplateSections).map((s) => ({
      type: OptionType.OPTION,
      value: `${GLOBAL}${LIST_DELIMITER}${s}`,
      label: MALTEKST_SECTION_NAMES[s],
      filterValue: `${ALL_TEMPLATES_LABEL} ${MALTEKST_SECTION_NAMES[s]}`,
    })),
  });

  if (includeNone) {
    return [{ ...NONE_OPTION, filterValue: NONE_OPTION.label, type: OptionType.OPTION }, ...options];
  }

  return options;
};

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
      case RichTextTypes.MALTEKST:
        return ELEMENT_MALTEKST;
      case RichTextTypes.REDIGERBAR_MALTEKST:
        return ELEMENT_REDIGERBAR_MALTEKST;
      case RichTextTypes.GOD_FORMULERING:
        return ELEMENT_REDIGERBAR_MALTEKST;
    }
  }, [textType]);
  const templates = useMemo(
    () => getTemplateOptions(sectionType, includeNoneOption, templatesSelectable),
    [includeNoneOption, sectionType, templatesSelectable],
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
