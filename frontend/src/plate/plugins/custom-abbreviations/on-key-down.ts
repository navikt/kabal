import { Keys } from '@app/keys';
import { pushEvent } from '@app/observability';
import { getAbbreviationData } from '@app/plate/plugins/custom-abbreviations/get-short-and-long';
import type { PlateEditor } from '@platejs/core/react';

export const onKeyDown = (editor: PlateEditor, e: React.KeyboardEvent) => {
  if (e.defaultPrevented) {
    return;
  }

  const { key } = e;

  if (
    key !== Keys.Space &&
    key !== Keys.Period &&
    key !== Keys.Comma &&
    key !== Keys.Colon &&
    key !== Keys.Semicolon &&
    key !== Keys.Exclamation &&
    key !== Keys.Question &&
    key !== Keys.Dash &&
    key !== Keys.Slash &&
    key !== Keys.Parenthesis &&
    key !== Keys.Bracket &&
    key !== Keys.Brace &&
    key !== Keys.AngleBracket &&
    key !== Keys.Asterisk &&
    key !== Keys.Quote &&
    key !== Keys.Guillemet
  ) {
    return;
  }

  const data = getAbbreviationData(editor);

  if (data === null) {
    return;
  }

  const { short, long, range, marks, autoCapitalised } = data;

  e.preventDefault();

  editor.tf.withoutMerging(() => {
    editor.tf.insertText(key);
    editor.tf.deleteBackward('character');
  });

  editor.tf.delete({ at: range });

  if (autoCapitalised) {
    const firstChar = long.charAt(0);
    const rest = long.substring(1);

    const uppercaseFirstChar = firstChar.toUpperCase();

    if (firstChar !== uppercaseFirstChar) {
      editor.tf.insertNodes([
        { ...marks, text: uppercaseFirstChar, autoCapitalised: true, abbreviation: short },
        { ...marks, text: `${rest}${key}`, abbreviation: short },
      ]);
    } else {
      editor.tf.insertNodes([{ ...marks, text: `${long}${key}`, abbreviation: short }]);
    }
  } else {
    editor.tf.insertNodes([{ ...marks, text: `${long}${key}`, abbreviation: short }]);
  }

  const numberOfMarks = Object.values(marks).filter((m) => m).length;

  pushEvent('smart-editor-insert-abbreviation', 'smart-editor', {
    short,
    long,
    trigger: key,
    marks: numberOfMarks.toString(10),
  });
};
