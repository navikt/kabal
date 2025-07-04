import { describe, expect, it } from 'bun:test';
import { ELEMENT_MALTEKSTSEKSJON, ELEMENT_REDIGERBAR_MALTEKST } from '@app/plate/plugins/element-types';
import { normalizeNodePlugin } from '@app/plate/plugins/normalize-node';
import { RedigerbarMaltekstPlugin } from '@app/plate/plugins/redigerbar-maltekst';
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
import { RichTextTypes } from '@app/types/common-text-types';
import { createPlateEditor, ParagraphPlugin } from '@platejs/core/react';
import { BaseBulletedListPlugin, BaseListItemContentPlugin, BaseListItemPlugin } from '@platejs/list-classic';
import { BaseParagraphPlugin } from 'platejs';

const createEditor = (value: KabalValue) => createPlateEditor({ plugins: [normalizeNodePlugin], value });

describe('normalize node with missing type prop', () => {
  it('should fix LICs', () => {
    const editor = createEditor([createSimpleParagraph()]);

    const invalidLic = { children: [{ text: 'lic' }] } as ListItemContainerElement;
    const invalidLi: ListItemElement = { type: BaseListItemPlugin.key, children: [invalidLic] };
    const invalidList: BulletListElement = { type: BaseBulletedListPlugin.key, children: [invalidLi] };

    editor.tf.replaceNodes(invalidList, { at: [0] });

    const validLic: ListItemContainerElement = { type: BaseListItemContentPlugin.key, children: [{ text: 'lic' }] };
    const validLi: ListItemElement = { type: BaseListItemPlugin.key, children: [validLic] };
    const validList: BulletListElement = { type: BaseBulletedListPlugin.key, children: [validLi] };

    expect(editor.children).toEqual([validList]);
  });

  it('should default to paragraph if node is at top level', () => {
    const editor = createEditor([createSimpleParagraph()]);

    const invalidNode = { children: [{ text: 'some text' }] } as H1Element;

    editor.tf.replaceNodes(invalidNode, { at: [0] });

    const defaultedNode = createSimpleParagraph('some text');

    expect(editor.children).toEqual([defaultedNode]);
  });

  it('should default parent node to paragraph if parent node does not have type', () => {
    const editor = createEditor([createSimpleParagraph()]);

    const invalidChild = { text: 'some text' };
    const invalidParent = { children: [invalidChild] } as H1Element;

    editor.tf.replaceNodes(invalidParent, { at: [0] });

    const defaultedNode = createSimpleParagraph('some text');

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

    editor.tf.replaceNodes(invalidMaltekstseksjon, { at: [0] });

    const validParagraph: ParagraphElement = createSimpleParagraph('some text');
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

  it('should unwrap nested paragraphs', () => {
    const nestedParagraph: ParagraphElement = {
      type: ParagraphPlugin.key,
      align: TextAlign.LEFT,
      children: [{ text: 'some text' }],
    };

    const paragraphChildren = [nestedParagraph] as unknown as ParagraphElement['children'];

    const topLevelParagraph: ParagraphElement = {
      type: ParagraphPlugin.key,
      align: TextAlign.LEFT,
      children: paragraphChildren,
    };

    const editor = createEditor([topLevelParagraph]);

    editor.tf.normalize({ force: true });

    expect(editor.children).toEqual([
      { type: BaseParagraphPlugin.key, align: TextAlign.LEFT, children: [{ text: 'some text' }] },
    ]);
  });

  it('should fix incorrect node types', () => {
    const nestedParagraph: ParagraphElement = {
      type: ParagraphPlugin.key,
      align: TextAlign.LEFT,
      children: [{ text: 'some text' }],
    };

    const redigerbarMaltekst: RedigerbarMaltekstElement = {
      type: RichTextTypes.REDIGERBAR_MALTEKST as unknown as typeof ELEMENT_REDIGERBAR_MALTEKST,
      section: TemplateSections.ANFOERSLER,
      children: [nestedParagraph],
    };

    const editor = createEditor([redigerbarMaltekst]);

    editor.tf.normalize({ force: true });

    expect(editor.children).toEqual([
      { type: RedigerbarMaltekstPlugin.key, section: TemplateSections.ANFOERSLER, children: [nestedParagraph] },
    ]);
  });
});
