import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';
import { INCLUDE_THRESHOLD, NEGATIVE_INFINITY } from '@app/plate/functions/lex-specialis/scores';

const GLOBAL_HJEMMEL_SCORE = 1;
const ONLY_YTELSE_SCORE = 2;
const YTELSE_AND_HJEMMEL_SCORE = 3;

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
export const getYtelseScore = (ytelseId: string, hjemmelList: string[], ytelseHjemmelList: string[]): number => {
  if (ytelseHjemmelList.length === 0) {
    return INCLUDE_THRESHOLD;
  }

  const ytelseHjemler = ytelseHjemmelList.map((ytelseHjemmel) => ytelseHjemmel.split(LIST_DELIMITER));

  for (const [y, h] of ytelseHjemler) {
    if (y === GLOBAL) {
      if (h === undefined) {
        return INCLUDE_THRESHOLD;
      }
      if (hjemmelList.includes(h)) {
        return GLOBAL_HJEMMEL_SCORE;
      }
    } else if (y === ytelseId) {
      if (h === undefined) {
        return ONLY_YTELSE_SCORE;
      }
      if (hjemmelList.includes(h)) {
        return YTELSE_AND_HJEMMEL_SCORE;
      }
    }
  }

  return NEGATIVE_INFINITY;
};
