import { describe, expect, it } from 'bun:test';
import { ELEMENT_MALTEKSTSEKSJON, ELEMENT_REDIGERBAR_MALTEKST } from '@app/plate/plugins/element-types';
import { normalizeNodePlugin } from '@app/plate/plugins/normalize-node';
import { TemplateSections } from '@app/plate/template-sections';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import {
  type BulletListElement,
  type H1Element,
  type KabalValue,
  type ListItemContainerElement,
  type ListItemElement,
  type MaltekstseksjonElement,
  type ParagraphElement,
  type RedigerbarMaltekstElement,
  TextAlign,
} from '@app/plate/types';
import { BaseParagraphPlugin, replaceNode } from '@udecode/plate-common';
import { createPlateEditor } from '@udecode/plate-core/react';
import { BaseBulletedListPlugin, BaseListItemContentPlugin, BaseListItemPlugin } from '@udecode/plate-list';

const createEditor = (value: KabalValue) => createPlateEditor({ plugins: [normalizeNodePlugin], value });

describe('normalize node with missing type prop', () => {
  it('should fix LICs', () => {
    const editor = createEditor([createSimpleParagraph()]);

    const invalidLic = { children: [{ text: 'lic' }] } as ListItemContainerElement;
    const invalidLi: ListItemElement = { type: BaseListItemPlugin.key, children: [invalidLic] };
    const invalidList: BulletListElement = { type: BaseBulletedListPlugin.key, children: [invalidLi] };

    replaceNode(editor, { at: [0], nodes: invalidList });

    const validLic: ListItemContainerElement = { type: BaseListItemContentPlugin.key, children: [{ text: 'lic' }] };
    const validLi: ListItemElement = { type: BaseListItemPlugin.key, children: [validLic] };
    const validList: BulletListElement = { type: BaseBulletedListPlugin.key, children: [validLi] };

    expect(editor.children).toEqual([validList]);
  });

  it('should default to paragraph if node is at top level', () => {
    const editor = createEditor([createSimpleParagraph()]);

    const invalidNode = { children: [{ text: 'some text' }] } as H1Element;

    replaceNode(editor, { at: [0], nodes: invalidNode });

    const defaultedNode: ParagraphElement = {
      type: BaseParagraphPlugin.key,
      align: TextAlign.LEFT,
      children: [{ text: 'some text' }],
    };

    expect(editor.children).toEqual([defaultedNode]);
  });

  it('should default parent node to paragraph if parent node does not have type', () => {
    const editor = createEditor([createSimpleParagraph()]);

    const invalidChild = { text: 'some text' };
    const invalidParent = { children: [invalidChild] } as H1Element;

    replaceNode(editor, { at: [0], nodes: invalidParent });

    const defaultedNode: ParagraphElement = {
      type: BaseParagraphPlugin.key,
      align: TextAlign.LEFT,
      children: [{ text: 'some text' }],
    };

    expect(editor.children).toEqual([defaultedNode]);
  });

  it('should fix descendants inside redigerbar maltekst (top level element)', () => {
    const invalidParagraph: ParagraphElement = { children: [{ text: 'some text' }] } as ParagraphElement;
    const invalidRedigerbarMaltekst: RedigerbarMaltekstElement = {
      type: ELEMENT_REDIGERBAR_MALTEKST,
      section: TemplateSections.ANFOERSLER,
      children: [invalidParagraph],
    };
    const invalidMaltekstseksjon: MaltekstseksjonElement = {
      type: ELEMENT_MALTEKSTSEKSJON,
      section: TemplateSections.REGELVERK_TITLE,
      textIdList: [],
      children: [invalidRedigerbarMaltekst],
    };

    const editor = createEditor([createSimpleParagraph()]);

    replaceNode(editor, { at: [0], nodes: invalidMaltekstseksjon });

    const validParagraph: ParagraphElement = { children: [{ text: 'some text' }] } as ParagraphElement;
    const validRedigerbarMaltekst: RedigerbarMaltekstElement = {
      type: ELEMENT_REDIGERBAR_MALTEKST,
      section: TemplateSections.ANFOERSLER,
      children: [validParagraph],
    };
    const validMaltekstseksjon: MaltekstseksjonElement = {
      type: ELEMENT_MALTEKSTSEKSJON,
      section: TemplateSections.REGELVERK_TITLE,
      textIdList: [],
      children: [validRedigerbarMaltekst],
    };

    expect(editor.children).toEqual([validMaltekstseksjon]);
  });
});
