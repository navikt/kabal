import { SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { isUtfall } from '@app/functions/is-utfall';
import { INCLUDE_THRESHOLD, NEGATIVE_INFINITY } from '@app/plate/functions/lex-specialis/scores';
import type { UtfallEnum } from '@app/types/kodeverk';

export const MAX_UTFALL_SCORE = 4;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
export const getUtfallScore = (utfallIdSet: UtfallEnum[], utfallSetList: string[]): number => {
  const parsedUtfallList = utfallSetList
    .map((utfallSet) => utfallSet.split(SET_DELIMITER).filter(isUtfall))
    .filter((s) => s.length > 0);

  // Oppgaven with no utfall.
  if (utfallIdSet.length === 0) {
    // Maltekstseksjon with no utfall.
    if (parsedUtfallList.length === 0) {
      return MAX_UTFALL_SCORE;
    }

    const minLength = parsedUtfallList.reduce(
      (min, { length }) => (length < min ? length : min),
      Number.POSITIVE_INFINITY,
    );

    return minLength === 0 ? MAX_UTFALL_SCORE : NEGATIVE_INFINITY;
  }

  // Maltekstseksjon with no utfall.
  if (parsedUtfallList.length === 0) {
    return INCLUDE_THRESHOLD;
  }

  const MATCH_WEIGHT = MAX_UTFALL_SCORE / utfallIdSet.length;
  let bestScore = NEGATIVE_INFINITY;

  for (const utfallSet of parsedUtfallList) {
    if (utfallSet.length > utfallIdSet.length) {
      continue;
    }

    let score = INCLUDE_THRESHOLD;

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
