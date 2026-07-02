import { useMemo } from 'react';
import { TemplateSections } from '@/plate/template-sections';
import { TEMPLATE_SECTIONS_MAP } from '@/plate/templates/templates';
import type { TemplateIdEnum } from '@/types/smart-editor/template-enums';

const EMPTY_LIST: TemplateSections[] = [];

interface GroupedTemplateSections {
  used: TemplateSections[];
  unused: TemplateSections[];
}

export const useTemplateSections = (templateId: TemplateIdEnum): GroupedTemplateSections =>
  useMemo(() => getTemplateSections(templateId), [templateId]);

export const getTemplateSections = (templateId: TemplateIdEnum): GroupedTemplateSections => {
  const used = TEMPLATE_SECTIONS_MAP[templateId];

  if (used === undefined) {
    return { used: EMPTY_LIST, unused: TEMPLATE_SECTIONS };
  }

  return { used, unused: TEMPLATE_SECTIONS.filter((s) => !used.includes(s)) };
};

const TEMPLATE_SECTIONS = Object.values(TemplateSections);
