import { pushEvent } from '@app/observability';
import { getShortAndLong } from '@app/plate/plugins/custom-abbreviations/get-short-and-long';
import type { PlateEditor } from '@udecode/plate-core/react';

const SPACE = ' ';
const PERIOD = '.';
const COMMA = ',';
const EXCLAMATION = '!';
const QUESTION = '?';
const COLON = ':';
const SEMICOLON = ';';
const DASH = '-';
const SLASH = '/';
const PARENTHESIS = ')';
const BRACKET = ']';
const BRACE = '}';
const ANGLE_BRACKET = '>';
const ASTERISK = '*';
const QUOTE = '"';
const GUILLEMET = '»';

export const onKeyDown = (editor: PlateEditor, e: React.KeyboardEvent) => {
  if (e.defaultPrevented) {
    return;
  }

  const { key } = e;

  if (
    key !== SPACE &&
    key !== PERIOD &&
    key !== COMMA &&
    key !== COLON &&
    key !== SEMICOLON &&
    key !== EXCLAMATION &&
    key !== QUESTION &&
    key !== DASH &&
    key !== SLASH &&
    key !== PARENTHESIS &&
    key !== BRACKET &&
    key !== BRACE &&
    key !== ANGLE_BRACKET &&
    key !== ASTERISK &&
    key !== QUOTE &&
    key !== GUILLEMET
  ) {
    return;
  }

  const shortAndLong = getShortAndLong(editor);

  if (shortAndLong === null) {
    return;
  }

  const { short, long, range, marks } = shortAndLong;

  e.preventDefault();

  editor.tf.withoutMerging(() => {
    editor.tf.insertText(key);
    editor.tf.deleteBackward('character');
  });

  editor.tf.delete({ at: range });
  editor.tf.insertNodes({ ...marks, text: `${long}${key}` });

  const numberOfMarks = Object.values(marks).filter((m) => m).length;

  pushEvent('smart-editor-insert-abbreviation', 'smart-editor', {
    short,
    long,
    trigger: key,
    marks: numberOfMarks.toString(10),
  });
};
