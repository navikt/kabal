import { type NestedOption, OptionType } from '@app/components/filter-dropdown/nested-filter-list';
import { GLOBAL, LIST_DELIMITER, NONE_OPTION, WILDCARD } from '@app/components/smart-editor-texts/types';
import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import { getTemplateSections } from '@app/hooks/use-template-sections';
import { TemplateSections } from '@app/plate/template-sections';
import { TEMPLATES } from '@app/plate/templates/templates';

export const ALL_TEMPLATES_LABEL = 'Alle maler';

export const getTemplateOptions = (includeNone: boolean, templatesSelectable: boolean): NestedOption[] => {
  const options: NestedOption[] = TEMPLATES.map(({ templateId, tittel }) => {
    const { used, unused } = getTemplateSections(templateId);

    const unusedOption = {
      type: OptionType.GROUP,
      value: 'UNUSED',
      label: 'Ubrukte seksjoner',
      filterValue: 'Ubrukte seksjoner',
      options: unused.map((s) => ({
        type: OptionType.OPTION,
        value: `${templateId}${LIST_DELIMITER}${s}`,
        label: MALTEKST_SECTION_NAMES[s],
        filterValue: `${tittel} ${MALTEKST_SECTION_NAMES[s]}`,
      })),
    };

    const usedOptions = used.map((s) => ({
      type: OptionType.OPTION,
      value: `${templateId}${LIST_DELIMITER}${s}`,
      label: MALTEKST_SECTION_NAMES[s],
      filterValue: `${tittel} ${MALTEKST_SECTION_NAMES[s]}`,
    }));

    return {
      type: templatesSelectable ? OptionType.OPTION : OptionType.GROUP,
      label: tittel,
      value: `${templateId}${LIST_DELIMITER}${WILDCARD}`,
      filterValue: templateId,
      options: usedOptions.concat(unusedOption),
    };
  });

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
