import React, { useMemo } from 'react';
import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import { TEMPLATES } from '@app/plate/templates/templates';
import { TemplateSections } from '@app/plate/types';
import { useKlageenheter, useLatestYtelser, useUtfall } from '@app/simple-api-state/use-kodeverk';
import { UtfallEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';

interface SectionSelectProps {
  children: string;
  selected: TemplateSections[];
  onChange: (value: TemplateSections[]) => void;
}

const SELECT_OPTIONS = Object.values(TemplateSections).map((value) => ({
  value,
  label: MALTEKST_SECTION_NAMES[value],
}));

export const SectionSelect = ({ selected, children, onChange }: SectionSelectProps) => (
  <FilterDropdown<TemplateSections>
    options={SELECT_OPTIONS}
    selected={selected}
    onChange={onChange}
    data-testid="edit-text-section-select"
  >
    {children}
  </FilterDropdown>
);

interface TemplateSelectProps {
  children: string;
  selected: TemplateIdEnum[];
  onChange: (value: TemplateIdEnum[]) => void;
}

const TEMPLATE_OPTIONS = TEMPLATES.map(({ templateId, tittel }) => ({ value: templateId, label: tittel }));

export const TemplateSelect = ({ selected, children, onChange }: TemplateSelectProps) => (
  <FilterDropdown<TemplateIdEnum>
    options={TEMPLATE_OPTIONS}
    selected={selected}
    onChange={onChange}
    data-testid="edit-text-template-select"
  >
    {children}
  </FilterDropdown>
);

interface UtfallSelectProps {
  children: string;
  selected: UtfallEnum[];
  onChange: (value: UtfallEnum[]) => void;
}

const EMPTY_ARRAY: [] = [];

export const UtfallSelect = ({ children, selected, onChange }: UtfallSelectProps) => {
  const { data: values = EMPTY_ARRAY } = useUtfall();

  const options = useMemo(
    () =>
      values
        .filter(({ id }) => id !== UtfallEnum.HENVIST && id !== UtfallEnum.HEVET)
        .map(({ id, navn }) => ({ value: id, label: navn })),
    [values],
  );

  return (
    <FilterDropdown options={options} selected={selected} onChange={onChange} data-testid="edit-text-utfall-select">
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

  const options = useMemo(() => values?.map(({ id, navn }) => ({ value: id, label: navn })) ?? [], [values]);

  return (
    <FilterDropdown options={options} selected={selected} onChange={onChange} data-testid="edit-text-klageenhet-select">
      {children}
    </FilterDropdown>
  );
};

interface YtelseSelectProps {
  children: string;
  selected: string[];
  onChange: (value: string[]) => void;
}

export const YtelseSelect = ({ children, selected, onChange }: YtelseSelectProps) => {
  const { data: values = [] } = useLatestYtelser();

  const options = useMemo(() => values?.map(({ id, navn }) => ({ value: id, label: navn })) ?? [], [values]);

  return (
    <FilterDropdown options={options} selected={selected} onChange={onChange} data-testid="edit-text-ytelse-select">
      {children}
    </FilterDropdown>
  );
};
