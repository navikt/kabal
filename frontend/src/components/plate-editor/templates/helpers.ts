import { ELEMENT_H1, ELEMENT_H2, ELEMENT_LI, ELEMENT_PARAGRAPH, ELEMENT_UL } from '@udecode/plate';
import { ELEMENT_CURRENT_DATE } from '@app/components/plate-editor/plugins/current-date';
import { ELEMENT_MALTEKST } from '@app/components/plate-editor/plugins/maltekst';
import { ELEMENT_PAGE_BREAK } from '@app/components/plate-editor/plugins/page-break';
import { ELEMENT_REDIGERBAR_MALTEKST } from '@app/components/plate-editor/plugins/redigerbar-maltekst';
import { ELEMENT_REGELVERK, ELEMENT_REGELVERK_CONTAINER } from '@app/components/plate-editor/plugins/regelverk';
import {
  BulletListElement,
  CurrentDateElement,
  H1Element,
  H2Element,
  MaltekstElement,
  PageBreakElement,
  ParagraphElement,
  RedigerbarMaltekstElement,
  RegelverkContainerElement,
  RegelverkElement,
  TextAlign,
  TopLevelElements,
} from '@app/components/plate-editor/types';
import { TemplateSections } from '@app/types/texts/texts';

// export const createLabelContent = (source: string, label: string): LabelContentElementType => ({
//   type: UndeletableVoidElementsEnum.LABEL_CONTENT,
//   children: [{ text: '' }],
//   source,
//   label,
//   threadIds: [],
// });

export const createMaltekst = (section: TemplateSections): MaltekstElement => ({
  type: ELEMENT_MALTEKST,
  section,
  children: [createSimpleParagraph()],
});

export const createRedigerbarMaltekst = (section: TemplateSections): RedigerbarMaltekstElement => ({
  type: ELEMENT_REDIGERBAR_MALTEKST,
  section,
  children: [createSimpleParagraph()],
});

const createRegelverkContainer = (
  children: TopLevelElements[] = [createSimpleParagraph()]
): RegelverkContainerElement => ({
  type: ELEMENT_REGELVERK_CONTAINER,
  children,
});

export const createRegelverk = (): RegelverkElement => ({
  type: ELEMENT_REGELVERK,
  section: TemplateSections.REGELVERK,
  children: [createPageBreak(), createMaltekst(TemplateSections.REGELVERK), createRegelverkContainer()],
});

// eslint-disable-next-line import/no-unused-modules
export const createHeadingOne = (text: string): H1Element => ({
  type: ELEMENT_H1,
  children: [{ text }],
});

// eslint-disable-next-line import/no-unused-modules
export const createHeadingTwo = (text: string): H2Element => ({
  type: ELEMENT_H2,
  children: [{ text }],
});

export const createSimpleParagraph = (text = ''): ParagraphElement => ({
  type: ELEMENT_PARAGRAPH,
  align: TextAlign.LEFT,
  children: [{ text }],
});

// eslint-disable-next-line import/no-unused-modules
export const createSimpleBulletList = (...textItems: string[]): BulletListElement => ({
  type: ELEMENT_UL,
  children: textItems.map((text) => ({
    type: ELEMENT_LI,
    children: [{ text }],
  })),
});

// export const createSignature = (): SignatureElementType => ({
//   type: UndeletableVoidElementsEnum.SIGNATURE,
//   useShortName: false,
//   children: [{ text: '' }],
//   threadIds: [],
// });

// eslint-disable-next-line import/no-unused-modules
export const createPageBreak = (): PageBreakElement => ({
  type: ELEMENT_PAGE_BREAK,
  children: [{ text: '' }],
});

export const createCurrentDate = (): CurrentDateElement => ({
  type: ELEMENT_CURRENT_DATE,
  children: [{ text: '' }],
});

// export const createHeader = (): HeaderElementType => ({
//   type: UndeletableVoidElementsEnum.HEADER,
//   children: [{ text: '' }],
//   threadIds: [],
//   content: null,
// });

// export const createFooter = (): FooterElementType => ({
//   type: UndeletableVoidElementsEnum.FOOTER,
//   children: [{ text: '' }],
//   threadIds: [],
//   content: null,
// });
