/* eslint-disable max-lines */
import { ELEMENT_PARAGRAPH } from '@udecode/plate';
import { ELEMENT_PAGE_BREAK } from '@app/components/plate-editor/plugins/page-break';
import { ELEMENT_PLACEHOLDER } from '@app/components/plate-editor/plugins/placeholder';
import { ELEMENT_REDIGERBAR_MALTEKST } from '@app/components/plate-editor/plugins/redigerbar-maltekst';
import { EditorValue, TextAlign } from '@app/components/plate-editor/types';
import { TemplateSections } from '@app/types/texts/texts';

export const INITIAL_VALUE: EditorValue = [
  {
    type: 'p',
    align: TextAlign.LEFT,
    children: [
      {
        text: 'All the Slate examples are written in TypeScript. However, ',
      },
      { text: 'most', italic: true },
      { text: ' of them use ', underline: true },
      { text: 'implicit', bold: true },
      {
        text: " typings in many places because it makes it easier to see the actual Slate-specific code—especially for people who don't know TypeScript.",
      },
    ],
  },
  {
    type: 'p',
    align: TextAlign.LEFT,

    indent: 2,
    children: [{ text: 'This text is indented' }],
  },
  {
    type: 'p',
    align: TextAlign.LEFT,

    children: [{ text: 'Normal text' }, { type: 'leaf', text: 'Leaf text' }],
  },
  {
    type: 'table',
    align: TextAlign.LEFT,
    children: [
      {
        type: 'tr',

        children: [
          {
            type: 'td',

            children: [{ type: 'p', align: TextAlign.LEFT, children: [{ text: 'Cell 1' }] }],
          },
          {
            type: 'td',

            children: [{ type: 'p', align: TextAlign.LEFT, children: [{ text: 'Cell 2' }] }],
          },
        ],
      },
      {
        type: 'tr',

        children: [
          {
            type: 'td',

            children: [{ type: 'p', align: TextAlign.LEFT, children: [{ text: 'Cell 3' }] }],
          },
          {
            type: 'td',

            children: [
              {
                type: 'ul',

                children: [
                  {
                    type: 'li',

                    children: [{ text: 'List item 1' }],
                  },
                  {
                    type: 'li',

                    children: [{ text: 'List item 2' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'h2',
    children: [{ text: 'Numbered list' }],
  },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [{ text: 'List item 1' }],
      },
      {
        type: 'li',
        children: [{ text: 'List item 2' }],
      },
    ],
  },
  {
    type: 'h1',
    children: [{ text: 'Bullet list' }],
  },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [{ text: 'List item 1' }],
      },
      {
        type: 'li',
        children: [{ text: 'List item 2' }],
      },
    ],
  },
  {
    type: 'maltekst',
    section: TemplateSections.TITLE,
    children: [
      {
        type: 'h2',
        children: [{ text: 'Maltekst start' }],
      },
      {
        type: 'p',
        children: [
          {
            text: 'All the Slate examples are written in TypeScript. However, ',
          },
          { text: 'most', italic: true },
          { text: ' of them use ', underline: true },
          { text: 'implicit', bold: true },
          {
            text: " typings in many places because it makes it easier to see the actual Slate-specific code—especially for people who don't know TypeScript.",
          },
        ],
      },
      {
        type: 'p',
        children: [
          { text: 'This example is written with ' },
          { text: 'explicit', bold: true },
          {
            text: ' typings in all places, so you can see what a more realistic TypeScript usage would look like.',
          },
        ],
      },
      {
        type: 'p',
        indent: 2,
        children: [{ text: 'This text is indented' }],
      },
      {
        type: 'p',
        children: [{ text: 'Normal text' }, { type: 'leaf', text: 'Leaf text' }],
      },
      {
        type: 'table',
        children: [
          {
            type: 'tr',
            children: [
              {
                type: 'td',
                children: [{ type: 'p', children: [{ text: 'Cell 1' }] }],
              },
              {
                type: 'td',
                children: [{ type: 'p', children: [{ text: 'Cell 2' }] }],
              },
            ],
          },
          {
            type: 'tr',
            children: [
              {
                type: 'td',
                children: [{ type: 'p', children: [{ text: 'Cell 3' }] }],
              },
              {
                type: 'td',
                children: [
                  {
                    type: 'ul',
                    children: [
                      {
                        type: 'li',
                        children: [{ text: 'List item 1' }],
                      },
                      {
                        type: 'li',
                        children: [{ text: 'List item 2' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'h2',
        children: [{ text: 'Numbered list' }],
      },
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ text: 'List item 1' }],
          },
          {
            type: 'li',
            children: [{ text: 'List item 2' }],
          },
        ],
      },
      {
        type: 'h1',
        children: [{ text: 'Bullet list' }],
      },
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ text: 'List item 1' }],
          },
          {
            type: 'li',
            children: [{ text: 'List item 2' }],
          },
        ],
      },
      {
        type: 'h2',
        children: [{ text: 'Maltekst end' }],
      },
    ],
  },
  {
    type: 'p',
    align: TextAlign.LEFT,
    children: [
      { text: 'This example is written with ' },
      { text: 'explicit', bold: true },
      {
        text: ' typings in all places, so you can see what a more realistic TypeScript usage would look like.',
      },
    ],
  },
  {
    type: ELEMENT_REDIGERBAR_MALTEKST,
    section: TemplateSections.GENERELL_INFO,
    children: [{ type: 'p', align: TextAlign.LEFT, children: [{ text: '' }] }],
  },
  {
    type: ELEMENT_PARAGRAPH,
    align: TextAlign.LEFT,

    children: [
      { text: 'Before comment. ' },
      { text: 'Commented text in the document', comment: true, comment_1: true },
      { text: '. After comment.' },
    ],
  },
  {
    type: ELEMENT_PARAGRAPH,
    align: TextAlign.LEFT,

    children: [
      { text: 'Before placeholder. ' },
      {
        type: ELEMENT_PLACEHOLDER,
        placeholder: 'Skriv noe her',
        children: [{ text: '' }],
      },
      { text: '. After placeholder.' },
    ],
  },
  {
    type: ELEMENT_PAGE_BREAK,
    children: [{ text: '' }],
  },
  {
    type: ELEMENT_PARAGRAPH,
    align: TextAlign.LEFT,
    children: [{ text: 'Page 2' }],
  },
  {
    type: ELEMENT_PARAGRAPH,
    align: TextAlign.RIGHT,
    children: [{ text: 'Right-aligned' }],
  },
  {
    type: ELEMENT_REDIGERBAR_MALTEKST,
    section: TemplateSections.INTRODUCTION,
    children: [{ type: ELEMENT_PARAGRAPH, align: TextAlign.LEFT, children: [{ text: '' }] }],
  },
];
