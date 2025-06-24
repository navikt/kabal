// If there is no previous word, we can assume that the current word is the start of a sentence.

import { isOrdinalOrAbbreviation, skipCapitalisation } from '@app/plate/plugins/capitalise/helpers';
import type { PlateEditor } from '@platejs/core/react';

// If the previous word ends with a sentence-ending punctuation mark, we can assume that the current word is the start of a sentence.
export const autoCapitalise = (editor: PlateEditor, text: string) => {
  if (skipCapitalisation(editor) || isOrdinalOrAbbreviation(editor)) {
    return text;
  }

  return capitaliseWord(text);
};

export const capitaliseWord = (text: string) => text.charAt(0).toUpperCase() + text.substring(1);
