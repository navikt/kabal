import { TDescendant, isElement } from '@udecode/plate-common';
import { useMemo } from 'react';
import {
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_REDIGERBAR_MALTEKST,
} from '@app/plate/plugins/element-types';
import { TemplateSections } from '@app/plate/template-sections';
import { TEMPLATE_MAP } from '@app/plate/templates/templates';
import { EditorValue } from '@app/plate/types';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const EMPTY_LIST: TemplateSections[] = [];

export type SectionType =
  | typeof ELEMENT_MALTEKSTSEKSJON
  | typeof ELEMENT_MALTEKST
  | typeof ELEMENT_REDIGERBAR_MALTEKST
  | typeof ELEMENT_FOOTER
  | typeof ELEMENT_HEADER;

export const useTemplateSections = (templateId: TemplateIdEnum, sectionType?: SectionType): TemplateSections[] =>
  useMemo(() => getTemplateSections(templateId, sectionType), [templateId, sectionType]);

export const getTemplateSections = (templateId: TemplateIdEnum, sectionType?: SectionType): TemplateSections[] => {
  const template = TEMPLATE_MAP[templateId];

  if (template === undefined) {
    return EMPTY_LIST;
  }

  return getSections(template.richText as EditorValue, sectionType);
};

const getSections = (children: TDescendant[], sectionType?: SectionType): TemplateSections[] => {
  const sectionSet = new Set<TemplateSections>();

  for (const element of children) {
    if (isElement(element)) {
      if ('section' in element && isTemplateSection(element.section)) {
        const sectionTypeMatches = sectionType === undefined || element.type === sectionType;

        if (sectionTypeMatches) {
          sectionSet.add(element.section);
        }
      }

      for (const s of getSections(element.children, sectionType)) {
        sectionSet.add(s);
      }
    }
  }

  return Array.from(sectionSet);
};

const TEMPLATE_SECTIONS = Object.values(TemplateSections);

const isTemplateSection = (section: unknown): section is TemplateSections =>
  typeof section === 'string' && TEMPLATE_SECTIONS.some((s) => s === section);
