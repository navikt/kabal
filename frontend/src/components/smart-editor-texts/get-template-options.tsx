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
import { TEMPLATES } from '@app/plate/templates/templates';
import { RichTextTypes } from '@app/types/common-text-types';

export const ALL_TEMPLATES_LABEL = 'Alle maler';

export type TextType =
  | RichTextTypes.MALTEKST
  | RichTextTypes.REDIGERBAR_MALTEKST
  | RichTextTypes.GOD_FORMULERING
  | RichTextTypes.MALTEKSTSEKSJON;

const getSectionType = (textType: TextType): SectionType | undefined => {
  switch (textType) {
    case RichTextTypes.MALTEKSTSEKSJON:
      return ELEMENT_MALTEKSTSEKSJON;
    case RichTextTypes.MALTEKST:
      return ELEMENT_MALTEKST;
    case RichTextTypes.REDIGERBAR_MALTEKST:
      return ELEMENT_REDIGERBAR_MALTEKST;
    default:
      return undefined;
  }
};

export const getTemplateOptions = (
  textType: TextType,
  includeNone: boolean,
  templatesSelectable: boolean,
): NestedOption[] => {
  const isMaltekst = textType !== RichTextTypes.GOD_FORMULERING;

  const options: NestedOption[] = [];

  for (const { templateId, tittel } of TEMPLATES) {
    const sections = getTemplateSections(templateId, getSectionType(textType));

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
