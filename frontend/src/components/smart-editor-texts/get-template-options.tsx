import { type NestedOption, OptionType } from '@app/components/filter-dropdown/nested-filter-list';
import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import { GLOBAL, LIST_DELIMITER, NONE_OPTION, WILDCARD } from '@app/components/smart-editor-texts/types';
import { getTemplateSections } from '@app/hooks/use-template-sections';
import { DeprecatedTemplateSections, TemplateSections } from '@app/plate/template-sections';
import { TEMPLATES } from '@app/plate/templates/templates';
import { Tag } from '@navikt/ds-react';

export const ALL_TEMPLATES_LABEL = 'Alle maler';
export const DEPRECATED_SECTIONS_LABEL = 'Utgåtte seksjoner';

export const getTemplateOptions = (
  selected: string[],
  includeNone: boolean,
  includeDeprecated: boolean,
  templatesSelectable: boolean,
): NestedOption[] => {
  const options: NestedOption[] = [];

  if (includeNone) {
    options.push({ ...NONE_OPTION, filterValue: NONE_OPTION.label, type: OptionType.OPTION });
  }

  // Build a map of section -> count of templates that use it
  const sectionUsageCount = new Map<string, number>();
  for (const { templateId } of TEMPLATES) {
    const { used } = getTemplateSections(templateId);
    for (const section of used) {
      sectionUsageCount.set(section, (sectionUsageCount.get(section) ?? 0) + 1);
    }
  }

  for (const { templateId, tittel, deprecatedSections } of TEMPLATES) {
    const { used, unused } = getTemplateSections(templateId);

    const unusedOptions = unused.map<NestedOption>((s) => ({
      type: OptionType.OPTION,
      value: `${templateId}${LIST_DELIMITER}${s}`,
      label: MALTEKST_SECTION_NAMES[s],
      filterValue: `${tittel} ${MALTEKST_SECTION_NAMES[s]}`,
      indeterminate: selected.includes(`${GLOBAL}${LIST_DELIMITER}${s}`),
      tags: [
        <Tag data-color="info" size="xsmall" variant="strong" key={s}>
          {`${sectionUsageCount.get(s) ?? 0} maler`}
        </Tag>,
      ],
    }));

    const unusedOptionsGroup: NestedOption = {
      type: OptionType.GROUP,
      value: 'UNUSED',
      label: 'Seksjoner som ikke er i denne malen',
      filterValue: 'Ubrukte seksjoner',
      options: unusedOptions,
    };

    const usedOptions = used.map<NestedOption>((s) => ({
      type: OptionType.OPTION,
      value: `${templateId}${LIST_DELIMITER}${s}`,
      label: MALTEKST_SECTION_NAMES[s],
      filterValue: `${tittel} ${MALTEKST_SECTION_NAMES[s]}`,
      indeterminate: selected.includes(`${GLOBAL}${LIST_DELIMITER}${s}`),
      tags: [
        <Tag data-color="info" size="xsmall" variant="strong" key={s}>
          {`${sectionUsageCount.get(s) ?? 0} maler`}
        </Tag>,
      ],
    }));

    const templateOptions = usedOptions.concat(unusedOptionsGroup);

    if (includeDeprecated && deprecatedSections.length > 0) {
      const deprecatedOptions = deprecatedSections.map<NestedOption>((s) => ({
        type: OptionType.OPTION,
        value: `${templateId}${LIST_DELIMITER}${s}`,
        label: MALTEKST_SECTION_NAMES[s],
        filterValue: `${tittel} ${MALTEKST_SECTION_NAMES[s]}`,
        indeterminate: selected.includes(`${GLOBAL}${LIST_DELIMITER}${s}`),
        tags: [
          <Tag data-color="info" size="xsmall" variant="strong" key={s}>
            {`${sectionUsageCount.get(s) ?? 0} maler`}
          </Tag>,
        ],
      }));

      const deprecatedOptionsGroup: NestedOption = {
        type: OptionType.GROUP,
        value: 'DEPRECATED',
        label: DEPRECATED_SECTIONS_LABEL,
        filterValue: DEPRECATED_SECTIONS_LABEL,
        options: deprecatedOptions,
      };

      templateOptions.push(deprecatedOptionsGroup);
    }

    options.push({
      type: templatesSelectable ? OptionType.OPTION : OptionType.GROUP,
      label: tittel,
      value: `${templateId}${LIST_DELIMITER}${WILDCARD}`,
      filterValue: templateId,
      options: templateOptions,
      indeterminate: selected.some((s) => s.startsWith(`${templateId}${LIST_DELIMITER}`)),
      tags: [
        <Tag data-color="info" size="xsmall" variant="strong" key={`${templateId}-sections`}>
          {`${used.length} seksjoner`}
        </Tag>,
      ],
    });
  }

  const globalOptions: NestedOption[] = Object.values(TemplateSections).map((s) => ({
    type: OptionType.OPTION,
    value: `${GLOBAL}${LIST_DELIMITER}${s}`,
    label: MALTEKST_SECTION_NAMES[s],
    filterValue: `${ALL_TEMPLATES_LABEL} ${MALTEKST_SECTION_NAMES[s]}`,
    tags: [
      <Tag data-color="info" size="xsmall" variant="strong" key={s}>
        {`${sectionUsageCount.get(s) ?? 0} maler`}
      </Tag>,
    ],
  }));

  if (includeDeprecated) {
    const globalDeprecatedOptions: NestedOption[] = Object.values(DeprecatedTemplateSections).map((s) => ({
      type: OptionType.OPTION,
      value: `${GLOBAL}${LIST_DELIMITER}${s}`,
      label: MALTEKST_SECTION_NAMES[s],
      filterValue: `${ALL_TEMPLATES_LABEL} ${MALTEKST_SECTION_NAMES[s]}`,
      tags: [
        <Tag data-color="info" size="xsmall" variant="strong" key={s}>
          {`${sectionUsageCount.get(s) ?? 0} maler`}
        </Tag>,
      ],
    }));

    const globalDeprecatedOptionsGroup: NestedOption = {
      type: OptionType.GROUP,
      label: DEPRECATED_SECTIONS_LABEL,
      value: `${GLOBAL}${LIST_DELIMITER}${WILDCARD}`,
      filterValue: DEPRECATED_SECTIONS_LABEL,
      options: globalDeprecatedOptions,
    };

    globalOptions.push(globalDeprecatedOptionsGroup);
  }

  options.push({
    type: templatesSelectable ? OptionType.OPTION : OptionType.GROUP,
    label: ALL_TEMPLATES_LABEL,
    value: GLOBAL,
    filterValue: '',
    indeterminate: selected.some((s) => s.startsWith(`${GLOBAL}${LIST_DELIMITER}`)),
    options: globalOptions,
    tags: [
      <Tag data-color="info" size="xsmall" variant="strong" key="global-sections">
        {`${globalOptions.length} seksjoner`}
      </Tag>,
    ],
  });

  return options;
};
