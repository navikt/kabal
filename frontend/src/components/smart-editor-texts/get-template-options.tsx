import { NestedOption, OptionType } from '@app/components/filter-dropdown/nested-filter-list';
import { MALTEKST_SECTION_NAMES } from '@app/components/smart-editor/constants';
import { GLOBAL, LIST_DELIMITER, NONE_OPTION, WILDCARD } from '@app/components/smart-editor-texts/types';
import { SectionType, getTemplateSections } from '@app/hooks/use-template-sections';
import {
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_REDIGERBAR_MALTEKST,
} from '@app/plate/plugins/element-types';
import { TemplateSections } from '@app/plate/template-sections';
import { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { Immutable } from '@app/types/types';

export const ALL_TEMPLATES_LABEL = 'Alle maler';

export const getTemplateOptions = (
  sectionType: SectionType,
  includeNone: boolean,
  templatesSelectable: boolean,
  templates: Immutable<IMutableSmartEditorTemplate>[],
): NestedOption[] => {
  const isMaltekst =
    sectionType === ELEMENT_MALTEKST ||
    sectionType === ELEMENT_REDIGERBAR_MALTEKST ||
    sectionType === ELEMENT_MALTEKSTSEKSJON;

  const options: NestedOption[] = [];

  for (const { templateId, tittel } of templates) {
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
