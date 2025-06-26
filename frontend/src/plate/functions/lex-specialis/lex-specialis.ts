import { INCLUDE_THRESHOLD, NEGATIVE_INFINITY } from '@app/plate/functions/lex-specialis/scores';
import { getTemplateScore } from '@app/plate/functions/lex-specialis/template-score';
import { getUtfallScore } from '@app/plate/functions/lex-specialis/utfall-score';
import { getYtelseScore } from '@app/plate/functions/lex-specialis/ytelse-score';
import type { TemplateSections } from '@app/plate/template-sections';
import type { UtfallEnum } from '@app/types/kodeverk';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { IConsumerRichText } from '@app/types/texts/consumer';

export enum LexSpecialisStatus {
  FOUND = 'FOUND',
  TIE = 'TIE',
  NONE = 'NONE',
}

export interface ScoredText<T> {
  maltekstseksjon: T;
  score: number;
}

type FoundResult<T> = [LexSpecialisStatus.FOUND, T];

type TieResult<T> = [LexSpecialisStatus.TIE, ScoredText<T>[]];

const getTieResult = <T>(list: ScoredText<T>[]): TieResult<T> => [LexSpecialisStatus.TIE, list];

type NoneResult = [LexSpecialisStatus.NONE];

const NONE_RESULT: NoneResult = [LexSpecialisStatus.NONE];

type Result<T> = NoneResult | TieResult<T> | FoundResult<T>;

/**
 * Lex specialis algorithm for selecting the most specific text.
 *
 * In case of a tie, the function returns `null`.
 *
 * If no text is found, the function returns `undefined`.
 * @param templateId The template ID of the document.
 * @param sectionId The section ID of the section.
 * @param ytelseId The ytelse ID of the case.
 * @param hjemmelIdList The hjemmel ID list on the case.
 * @param utfallIdSet The utfall ID set on the case.
 * @param maltekstseksjonList List of maltekstseksjon.
 * @returns The most specific text and a result status.
 */
export const lexSpecialis = <T extends IConsumerRichText | IMaltekstseksjon>(
  templateId: TemplateIdEnum,
  sectionId: TemplateSections,
  ytelseId: string,
  hjemmelIdList: string[],
  utfallIdSet: UtfallEnum[],
  maltekstseksjonList: T[],
): Result<T> => {
  if (maltekstseksjonList.length === 0) {
    return NONE_RESULT;
  }

  if (maltekstseksjonList.length === 1) {
    const [maltekstseksjon] = maltekstseksjonList;

    if (maltekstseksjon === undefined) {
      return NONE_RESULT;
    }

    const score = getScore(templateId, sectionId, ytelseId, hjemmelIdList, utfallIdSet, maltekstseksjon);

    if (score <= INCLUDE_THRESHOLD) {
      return NONE_RESULT;
    }

    return [LexSpecialisStatus.FOUND, maltekstseksjon];
  }

  const scoredTexts = maltekstseksjonList
    .map<ScoredText<T>>((m) => {
      const score = getScore(templateId, sectionId, ytelseId, hjemmelIdList, utfallIdSet, m);

      return { maltekstseksjon: m, score };
    })
    .filter((st) => st.score > INCLUDE_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  const [first] = scoredTexts;

  if (first === undefined) {
    return NONE_RESULT;
  }

  let firstUntiedText = null;

  for (const scoredText of scoredTexts) {
    const hasUniqueScore = scoredTexts.every((st) => scoredText === st || scoredText.score !== st.score);

    if (hasUniqueScore) {
      firstUntiedText = scoredText;
      break;
    }
  }

  if (firstUntiedText === null) {
    return getTieResult(scoredTexts);
  }

  return [LexSpecialisStatus.FOUND, firstUntiedText.maltekstseksjon];
};

const getScore = <T extends IConsumerRichText | IMaltekstseksjon>(
  templateId: TemplateIdEnum,
  sectionId: string,
  ytelseId: string,
  hjemmelIdList: string[],
  utfallIdSet: UtfallEnum[],
  maltekstseksjon: T,
): number => {
  const templateScore = getTemplateScore(templateId, sectionId, maltekstseksjon.templateSectionIdList);

  if (templateScore === NEGATIVE_INFINITY) {
    return templateScore;
  }

  const ytelseScore = getYtelseScore(ytelseId, hjemmelIdList, maltekstseksjon.ytelseHjemmelIdList);

  if (ytelseScore === NEGATIVE_INFINITY) {
    return ytelseScore;
  }

  const utfallScore = getUtfallScore(utfallIdSet, maltekstseksjon.utfallIdList);

  if (utfallScore === NEGATIVE_INFINITY) {
    return utfallScore;
  }

  return templateScore + ytelseScore + utfallScore;
};
