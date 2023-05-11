/* eslint-disable max-lines */
import {
  ELEMENT_H1,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TR,
  ELEMENT_UL,
} from '@udecode/plate';
import {
  ELEMENT_MALTEKST,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
} from '@app/components/plate-editor/plugins/element-types';
import {
  createCurrentDate,
  createRegelverk,
  createSimpleParagraph,
} from '@app/components/plate-editor/templates/helpers';
import { EditorValue, TextAlign } from '@app/components/plate-editor/types';
import { TemplateSections } from '@app/types/texts/template-sections';

export const INITIAL_VALUE: EditorValue = [
  createCurrentDate(),
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
    type: ELEMENT_TABLE,
    children: [
      {
        type: ELEMENT_TR,
        children: [
          {
            type: ELEMENT_TD,
            children: [{ type: ELEMENT_PARAGRAPH, align: TextAlign.LEFT, children: [{ text: '1a sddasda' }] }],
          },
          {
            type: ELEMENT_TD,
            children: [{ type: ELEMENT_PARAGRAPH, align: TextAlign.LEFT, children: [{ text: '1b asdad' }] }],
          },
          {
            type: ELEMENT_TD,
            children: [{ type: ELEMENT_PARAGRAPH, align: TextAlign.LEFT, children: [{ text: '1c adsadwd' }] }],
          },
        ],
      },
      {
        type: ELEMENT_TR,
        children: [
          {
            type: ELEMENT_TD,
            children: [{ type: ELEMENT_PARAGRAPH, align: TextAlign.LEFT, children: [{ text: '2a sddasda' }] }],
          },
          {
            type: ELEMENT_TD,
            children: [{ type: ELEMENT_PARAGRAPH, align: TextAlign.LEFT, children: [{ text: '2b asdad' }] }],
          },
          {
            type: ELEMENT_TD,
            children: [{ type: ELEMENT_PARAGRAPH, align: TextAlign.LEFT, children: [{ text: '2c adsadwd' }] }],
          },
        ],
      },
      {
        type: ELEMENT_TR,
        children: [
          {
            type: ELEMENT_TD,
            children: [{ type: ELEMENT_PARAGRAPH, align: TextAlign.LEFT, children: [{ text: '3a sddasda' }] }],
          },
          {
            type: ELEMENT_TD,
            children: [{ type: ELEMENT_PARAGRAPH, align: TextAlign.LEFT, children: [{ text: '3b asdad' }] }],
          },
          {
            type: ELEMENT_TD,
            children: [{ type: ELEMENT_PARAGRAPH, align: TextAlign.LEFT, children: [{ text: '3c adsadwd' }] }],
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
    type: ELEMENT_OL,
    children: [
      {
        type: ELEMENT_LI,
        children: [
          { type: ELEMENT_LIC, children: [{ text: 'List item 1' }] },
          {
            type: ELEMENT_OL,
            children: [
              {
                type: ELEMENT_LI,
                children: [{ type: ELEMENT_LIC, children: [{ text: 'Sublist item 1.1' }] }],
              },
            ],
          },
        ],
      },
      {
        type: ELEMENT_LI,
        children: [{ type: ELEMENT_LIC, children: [{ text: 'List item 2' }] }],
      },
    ],
  },
  {
    type: 'h1',
    children: [{ text: 'Bullet list' }],
  },
  {
    type: ELEMENT_UL,
    children: [
      {
        type: ELEMENT_LI,
        children: [{ type: ELEMENT_LIC, children: [{ text: 'List item 1' }, { text: 'List item 2' }] }],
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
    type: ELEMENT_H1,
    children: [{ text: 'Maltekst below:' }],
  },
  {
    type: ELEMENT_MALTEKST,
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
    section: TemplateSections.GENERELL_INFO,
    children: [createSimpleParagraph()],
  },
  createRegelverk(),
];