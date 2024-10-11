import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';
import { NEGATIVE_INFINITY } from '@app/plate/functions/lex-specialis/scores';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const GLOBAL_SECTION_SCORE = 8;
const TEMPLATE_SECTION_SCORE = 16;

export const getTemplateScore = (
  templateId: TemplateIdEnum,
  section: string,
  templateSectionList: string[],
): number => {
  if (templateSectionList.length === 0) {
    return NEGATIVE_INFINITY;
  }

  const templateSections = templateSectionList.map((templateSection) => templateSection.split(LIST_DELIMITER));

  for (const [t, s] of templateSections) {
    if (t === GLOBAL) {
      if (s === undefined) {
        return NEGATIVE_INFINITY;
      }
      if (s === section) {
        return GLOBAL_SECTION_SCORE;
      }
    } else if (t === templateId) {
      if (s === undefined) {
        return NEGATIVE_INFINITY;
      }
      if (s === section) {
        return TEMPLATE_SECTION_SCORE;
      }
    }
  }

  return NEGATIVE_INFINITY;
};
