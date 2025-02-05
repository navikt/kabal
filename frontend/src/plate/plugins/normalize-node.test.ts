import { describe, expect, it } from 'bun:test';
import { ELEMENT_MALTEKSTSEKSJON, ELEMENT_REDIGERBAR_MALTEKST } from '@app/plate/plugins/element-types';
import { normalizeNodePlugin } from '@app/plate/plugins/normalize-node';
import { TemplateSections } from '@app/plate/template-sections';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import type {
  BulletListElement,
  H1Element,
  KabalValue,
  ListItemContainerElement,
  ListItemElement,
  MaltekstseksjonElement,
  ParagraphElement,
  RedigerbarMaltekstElement,
} from '@app/plate/types';
import { createPlateEditor } from '@udecode/plate-core/react';
import { BaseBulletedListPlugin, BaseListItemContentPlugin, BaseListItemPlugin } from '@udecode/plate-list';

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
});
