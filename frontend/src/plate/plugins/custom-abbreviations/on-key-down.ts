import {
  KeyboardHandlerReturnType,
  PlateEditor,
  deleteBackward,
  deleteText,
  insertNode,
  insertText,
  withoutMergingHistory,
} from '@udecode/plate-common';
import React from 'react';
import { getAbbreviation } from '@app/plate/plugins/custom-abbreviations/previous-word';

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

export const onKeyDown =
  (editor: PlateEditor): KeyboardHandlerReturnType =>
  (e: React.KeyboardEvent) => {
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

    const abbreviation = getAbbreviation(editor, key);

    if (abbreviation === null) {
      return;
    }

    const { long, range } = abbreviation;

    e.preventDefault();

    withoutMergingHistory(editor, () => {
      insertText(editor, key);
      deleteBackward(editor, { unit: 'character' });
    });

    deleteText(editor, { at: range });
    insertNode(editor, long);
  };
