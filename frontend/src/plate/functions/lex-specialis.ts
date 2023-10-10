import { GLOBAL, LIST_DELIMITER, SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { isUtfall } from '@app/functions/is-utfall';
import { UtfallEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { IRichText } from '@app/types/texts/texts';
import { TemplateSections } from '../template-sections';

const MAX_SCORE = 23;

export const lexSpecialis = (
  templateId: TemplateIdEnum,
  sectionId: TemplateSections,
  ytelseId: string,
  hjemmelIdList: string[],
  utfallIdSet: UtfallEnum[],
  richTexts: IRichText[],
): IRichText | null => {
  let text: IRichText | null = null;
  let highscore: number = -Infinity;

  for (const t of richTexts) {
    const templateScore = getTemplateScore(templateId, sectionId, t.templateSectionList);
    const ytelseScore = getYtelseScore(ytelseId, hjemmelIdList, t.ytelseHjemmelList);
    const utfallScore = getUtfallScore(utfallIdSet, t.utfall);

    const score = templateScore + ytelseScore + utfallScore;

    if (score === MAX_SCORE) {
      return t;
    }

    if (score > highscore) {
      text = t;
      highscore = score;
    }
  }

  return text;
};

const getTemplateScore = (templateId: TemplateIdEnum, section: string, templateSectionList: string[]): number => {
  if (templateSectionList.length === 0) {
    return -Infinity;
  }

  const templateSections = templateSectionList.map((templateSection) => templateSection.split(LIST_DELIMITER));

  for (const [t, s] of templateSections) {
    if (t === GLOBAL) {
      if (s === undefined) {
        return -Infinity;
      } else if (s === section) {
        return 8;
      }
    } else if (t === templateId) {
      if (s === undefined) {
        return -Infinity;
      } else if (s === section) {
        return 16;
      }
    }
  }

  return -Infinity;
};

const getYtelseScore = (ytelseId: string, hjemmelList: string[], ytelseHjemmelList: string[]): number => {
  if (ytelseHjemmelList.length === 0) {
    return 0;
  }

  const ytelseHjemler = ytelseHjemmelList.map((ytelseHjemmel) => ytelseHjemmel.split(LIST_DELIMITER));

  for (const [y, h] of ytelseHjemler) {
    if (y === GLOBAL) {
      if (h === undefined) {
        return 0;
      } else if (hjemmelList.includes(h)) {
        return 1;
      }
    } else if (y === ytelseId) {
      if (h === undefined) {
        return 2;
      } else if (hjemmelList.includes(h)) {
        return 3;
      }
    }
  }

  return -Infinity;
};

const getUtfallScore = (utfallIdSet: UtfallEnum[], utfallSetList: string[]): number => {
  if (utfallIdSet.length === 0 || utfallSetList.length === 0) {
    return 0;
  }

  const parsedUtfallList = utfallSetList.map((utfallSet) => utfallSet.split(SET_DELIMITER).filter(isUtfall));

  const MAX_UTFALL_SCORE = 4;
  const MATCH_WEIGHT = MAX_UTFALL_SCORE / utfallIdSet.length;
  let bestScore = -Infinity;

  for (const utfallSet of parsedUtfallList) {
    if (utfallSet.length > utfallIdSet.length) {
      continue;
    }

    let score = 0;

    for (const utfall of utfallSet) {
      if (utfallIdSet.includes(utfall)) {
        score += MATCH_WEIGHT;
      }
    }

    if (score > bestScore) {
      bestScore = score;
    }

    if (bestScore === MAX_UTFALL_SCORE) {
      return MAX_UTFALL_SCORE;
    }
  }

  return Math.round(bestScore);
};
