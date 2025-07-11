import { ELEMENT_MALTEKSTSEKSJON } from '@app/plate/plugins/element-types';
import { TemplateSections } from '@app/plate/template-sections';
import { TEMPLATE_MAP } from '@app/plate/templates/templates';
import type { MaltekstseksjonElement } from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { Descendant, Value } from 'platejs';
import { useMemo } from 'react';

const EMPTY_LIST: TemplateSections[] = [];

interface GroupedTemplateSections {
  used: TemplateSections[];
  unused: TemplateSections[];
}

export const useTemplateSections = (templateId: TemplateIdEnum): GroupedTemplateSections =>
  useMemo(() => getTemplateSections(templateId), [templateId]);

export const getTemplateSections = (templateId: TemplateIdEnum): GroupedTemplateSections => {
  const template = TEMPLATE_MAP[templateId];

  if (template === undefined) {
    return { used: EMPTY_LIST, unused: TEMPLATE_SECTIONS };
  }

  return getSections(template.richText as Value);
};

const getSections = (children: Descendant[]): GroupedTemplateSections => {
  const used = children
    .filter((c) => isOfElementType<MaltekstseksjonElement>(c, ELEMENT_MALTEKSTSEKSJON))
    .map((c) => c.section);

  const unused = TEMPLATE_SECTIONS.filter((s) => !used.includes(s));

  return { used, unused };
};

const TEMPLATE_SECTIONS = Object.values(TemplateSections);
