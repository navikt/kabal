import React, { useMemo } from 'react';
import { IOption } from '@app/components/filter-dropdown/props';
import { NONE_OPTION, NONE_TYPE } from '@app/components/smart-editor-texts/types';
import { useKlageenheter, useLatestYtelser, useUtfall } from '@app/simple-api-state/use-kodeverk';
import { UtfallEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { TemplateSections } from '@app/types/texts/texts';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { MALTEKST_SECTION_NAMES } from '../smart-editor/constants';
import { TEMPLATES } from '../smart-editor/templates/templates';

interface SectionSelectProps {
  children: string;
  selected: (TemplateSections | NONE_TYPE)[];
  onChange: (value: (TemplateSections | NONE_TYPE)[]) => void;
}

const SECTION_OPTIONS = [
  NONE_OPTION,
  ...Object.values(TemplateSections).map((value) => ({
    value,
    label: MALTEKST_SECTION_NAMES[value],
  })),
];

export const SectionSelect = ({ selected, children, onChange }: SectionSelectProps) => (
  <FilterDropdown options={SECTION_OPTIONS} selected={selected} onChange={onChange} data-testid="filter-section">
    {children}
  </FilterDropdown>
);

interface TemplateSelectProps {
  children: string;
  selected: TemplateIdEnum[];
  onChange: (value: (TemplateIdEnum | NONE_TYPE)[]) => void;
}

const TEMPLATE_OPTIONS = [
  NONE_OPTION,
  ...TEMPLATES.map(({ templateId, tittel }) => ({ value: templateId, label: tittel })),
];

export const TemplateSelect = ({ selected, children, onChange }: TemplateSelectProps) => (
  <FilterDropdown options={TEMPLATE_OPTIONS} selected={selected} onChange={onChange} data-testid="filter-template">
    {children}
  </FilterDropdown>
);

interface UtfallSelectProps {
  children: string;
  selected: (UtfallEnum | NONE_TYPE)[];
  onChange: (value: (UtfallEnum | NONE_TYPE)[]) => void;
}

const EMPTY_ARRAY: [] = [];

export const UtfallSelect = ({ children, selected, onChange }: UtfallSelectProps) => {
  const { data: values = EMPTY_ARRAY } = useUtfall();

  const options: IOption<UtfallEnum | NONE_TYPE>[] = useMemo(
    () => [
      NONE_OPTION,
      ...values
        .filter(({ id }) => id !== UtfallEnum.HENVIST && id !== UtfallEnum.HEVET)
        .map(({ id, navn }) => ({ value: id, label: navn })),
    ],
    [values],
  );

  return (
    <FilterDropdown options={options} selected={selected} onChange={onChange} data-testid="filter-utfall">
      {children}
    </FilterDropdown>
  );
};

interface KlageenhetSelectProps {
  children: string;
  selected: string[];
  onChange: (value: string[]) => void;
}

export const KlageenhetSelect = ({ children, selected, onChange }: KlageenhetSelectProps) => {
  const { data: values = [] } = useKlageenheter();

  const options = useMemo(
    () => [NONE_OPTION, ...values.map(({ id, navn }) => ({ value: id, label: navn }))] ?? [],
    [values],
  );

  return (
    <FilterDropdown options={options} selected={selected} onChange={onChange} data-testid="filter-klageenhet">
      {children}
    </FilterDropdown>
  );
};

interface YtelseSelectProps {
  children: string;
  selected: (string | NONE_TYPE)[];
  onChange: (value: (string | NONE_TYPE)[]) => void;
}

export const YtelseSelect = ({ children, selected, onChange }: YtelseSelectProps) => {
  const { data: values = [] } = useLatestYtelser();

  const options: IOption<string | NONE_TYPE>[] = useMemo(
    () => [NONE_OPTION, ...values.map(({ id, navn }) => ({ value: id, label: navn }))],
    [values],
  );

  return (
    <FilterDropdown options={options} selected={selected} onChange={onChange} data-testid="filter-ytelse">
      {children}
    </FilterDropdown>
  );
};
