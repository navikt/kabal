import React, { useMemo } from 'react';
import { useKodeverkValue } from '../../hooks/use-kodeverk-value';
import { IKodeverk, Utfall } from '../../types/kodeverk';
import { TemplateIdEnum } from '../../types/smart-editor/template-enums';
import { TemplateSections } from '../../types/texts/texts';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { MALTEKST_SECTION_NAMES } from '../smart-editor/constants';
import { TEMPLATES } from '../smart-editor/templates/templates';

interface Props<K extends keyof IKodeverk, T extends string = string> {
  children: string;
  selected: T[];
  kodeverkKey: K;
  onChange: (value: T[], kodeverkKey: K) => void;
}

export const KodeverkSelect = <K extends keyof IKodeverk, T extends string = string>({
  selected,
  kodeverkKey,
  children,
  onChange,
}: Props<K, T>) => {
  const values = useKodeverkValue(kodeverkKey);
  const options = useMemo(() => values?.map(({ id, navn }) => ({ value: id as T, label: navn })) ?? [], [values]);

  return (
    <FilterDropdown options={options} selected={selected} onChange={(value) => onChange(value, kodeverkKey)}>
      {children}
    </FilterDropdown>
  );
};

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
  <FilterDropdown<TemplateSections> options={SELECT_OPTIONS} selected={selected} onChange={onChange}>
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
  <FilterDropdown<TemplateIdEnum> options={TEMPLATE_OPTIONS} selected={selected} onChange={onChange}>
    {children}
  </FilterDropdown>
);

interface UtfallSelectProps {
  children: string;
  selected: Utfall[];
  onChange: (value: Utfall[]) => void;
}

export const UtfallSelect = ({ children, selected, onChange }: UtfallSelectProps) => {
  const values = useKodeverkValue('utfall');

  const options = useMemo(
    () =>
      (values ?? [])
        .filter(({ id }) => id !== Utfall.HENVIST && id !== Utfall.HEVET)
        .map(({ id, navn }) => ({ value: id, label: navn })),
    [values]
  );

  return (
    <FilterDropdown options={options} selected={selected} onChange={onChange}>
      {children}
    </FilterDropdown>
  );
};
