import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { type ParagraphElement, TextAlign } from '@app/plate/types';
import { isElement } from '@grafana/faro-web-sdk';
import type { TElement } from '@udecode/plate';
import { ParagraphPlugin, createPlatePlugin } from '@udecode/plate-core/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { ListItemContentPlugin } from '@udecode/plate-list/react';

export const PastePlugin = createPlatePlugin({
  key: 'paste',
  handlers: {
    onPaste: ({ editor, event }) => {
      // Pasting from PDFs in Chrome includes both text and HTML types.
      // Pasting from PDFs in Firefox includes only text type.
      if (event.clipboardData.types.some((t) => t !== 'text/plain' && t !== 'text/html')) {
        return false;
      }

      const plainText = event.clipboardData.getData('text/plain');

      // Nothing pasted to handle.
      if (plainText.length === 0) {
        return false;
      }

      const html = event.clipboardData.getData('text/html');

      // HTML content from PDFs in Chrome is equal to the plain text, with <meta charset="utf-8"> prepended.
      // Some browsers and OS will wrap the plain text in <!html><body>pain text</body></html>.
      if (!html.includes(plainText)) {
        // Pasted HTML not from PDF.
        return false;
      }

      event.preventDefault();

      const paragraphs = processParagraphs(plainText);

      const currentEntry = editor.api.node<TElement>({ mode: 'lowest', match: isElement });

      if (currentEntry === undefined) {
        editor.tf.insertFragment<ParagraphElement>(
          paragraphs.map((text) => ({ type: ParagraphPlugin.key, align: TextAlign.LEFT, children: [{ text }] })),
        );

        return true;
      }

      const [node] = currentEntry;

      switch (node.type) {
        case ELEMENT_PLACEHOLDER: {
          editor.tf.insertText(paragraphs.join(' '));

          return true;
        }
        case ParagraphPlugin.key:
        case ListItemContentPlugin.key: {
          const [first, ...rest] = paragraphs;

          if (first === undefined) {
            return false;
          }

          editor.tf.insertText(first);

          editor.tf.withoutNormalizing(() => {
            for (const line of rest) {
              editor.tf.insertBreak();
              editor.tf.insertFragment<ParagraphElement>([
                { type: ParagraphPlugin.key, align: TextAlign.LEFT, children: [{ text: line }] },
              ]);
            }
          });

          return true;
        }
        case HEADING_KEYS.h1:
        case HEADING_KEYS.h2:
        case HEADING_KEYS.h3:
        case HEADING_KEYS.h4:
        case HEADING_KEYS.h5:
        case HEADING_KEYS.h6: {
          const [first, ...rest] = paragraphs;

          if (first !== undefined) {
            editor.tf.insertText(first);

            if (rest.length > 0) {
              editor.tf.withoutNormalizing(() => {
                for (const line of rest) {
                  editor.tf.insertBreak();
                  editor.tf.insertFragment<ParagraphElement>([
                    { type: ParagraphPlugin.key, align: TextAlign.LEFT, children: [{ text: line }] },
                  ]);
                }
              });
            }

            return true;
          }
        }
      }

      editor.tf.withoutNormalizing(() => {
        for (const line of paragraphs) {
          editor.tf.insertFragment<ParagraphElement>([
            { type: ParagraphPlugin.key, align: TextAlign.LEFT, children: [{ text: line }] },
          ]);
        }
      });

      return true;
    },
  },
});

export const processParagraphs = (raw: string): string[] => {
  const rawLines = raw.split('\n');
  const paragraphList: string[] = [];

  let lastParagraph: string[] = [];
  let nextLineIndex = 0;

  for (const line of rawLines) {
    nextLineIndex++;
    lastParagraph.push(line);
    const nextLine = rawLines[nextLineIndex];

    if (nextLine !== undefined && !hasUnnaturalBreak(line, nextLine)) {
      continue;
    }

    paragraphList.push(lastParagraph.join(' ').trim());
    lastParagraph = [];
  }

  return paragraphList;
};

export const SMART_EDITOR_CONTENT_WIDTH = 642;

const hasUnnaturalBreak = (line: string, nextLine: string): boolean => {
  const lineLength = getTextWidth(line);
  const [firstWordOnNextLine] = nextLine.split(' ');
  const firstWordOnNextLineWidth = firstWordOnNextLine === undefined ? 0 : getTextWidth(firstWordOnNextLine);

  return lineLength + SPACE_CHAR_WIDTH + firstWordOnNextLineWidth < SMART_EDITOR_CONTENT_WIDTH;
};

export const getTextWidth = (text: string): number =>
  text.split('').reduce((acc, char) => acc + (CHAR_WIDTHS[char] ?? AVRAGE_CHAR_WIDTH), 0);

const CHAR_WIDTHS: Record<string, number> = {
  '0': 8,
  '1': 8,
  '2': 8,
  '3': 8,
  '4': 8,
  '5': 8,
  '6': 8,
  '7': 8,
  '8': 8,
  '9': 8,
  a: 8,
  b: 9,
  c: 7,
  d: 9,
  e: 8,
  f: 5,
  g: 8,
  h: 9,
  i: 4,
  j: 4,
  k: 8,
  l: 4,
  m: 13,
  n: 9,
  o: 9,
  p: 9,
  q: 9,
  r: 6,
  s: 7,
  t: 5,
  u: 9,
  v: 7,
  w: 12,
  x: 7,
  y: 7,
  z: 7,
  æ: 12,
  ø: 9,
  å: 8,
  A: 9,
  B: 9,
  C: 9,
  D: 10,
  E: 8,
  F: 8,
  G: 10,
  H: 10,
  I: 4,
  J: 8,
  K: 9,
  L: 8,
  M: 12,
  N: 10,
  O: 11,
  P: 9,
  Q: 11,
  R: 9,
  S: 9,
  T: 9,
  U: 10,
  V: 8,
  W: 13,
  X: 8,
  Y: 8,
  Z: 9,
  Æ: 13,
  Ø: 11,
  Å: 9,
  '.': 4,
  ',': 4,
  ':': 4,
  ';': 4,
  '§': 8,
  '<': 8,
  '>': 8,
  '"': 7,
  "'": 4,
  '#': 8,
  '€': 8,
  $: 8,
  '!': 5,
  '*': 7,
  '@': 14,
  '?': 7,
  '=': 8,
  ')': 5,
  '(': 5,
  '/': 6,
  '-': 5,
  _: 8,
  '%': 13,
  ' ': 3,
};

/**
 * Manually calculated average character width.
 * ```ts
 * const AVRAGE_CHAR_WIDTH = Object.values(CHAR_WIDTHS).reduce((acc, width) => acc + width, 0) / Object.keys(CHAR_WIDTHS).length;
 * ```
 */
const AVRAGE_CHAR_WIDTH = 8;

const SPACE_CHAR_WIDTH = CHAR_WIDTHS[' '] ?? AVRAGE_CHAR_WIDTH;
