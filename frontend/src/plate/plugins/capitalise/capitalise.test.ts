import { describe, expect, it } from 'bun:test';
import { beforeAll } from 'bun:test';
import { mock } from 'bun:test';
import { afterAll } from 'bun:test';
// biome-ignore lint/style/noNamespaceImport: Needed in order to restore after mock
import * as originalSettingsManager from '@app/hooks/settings/manager';
import { createCapitalisePlugin } from '@app/plate/plugins/capitalise/capitalise';
import { TemplateSections } from '@app/plate/template-sections';
import {
  createHeadingOne,
  createMaltekstseksjon,
  createRedigerbarMaltekst,
  createSimpleParagraph,
} from '@app/plate/templates/helpers';
import { type KabalValue, type ParagraphElement, TextAlign } from '@app/plate/types';
import { BaseH1Plugin } from '@platejs/basic-nodes';
import { BaseParagraphPlugin } from '@platejs/core';
import { type PlateEditor, createPlateEditor } from '@platejs/core/react';
import type { Point, Selection } from 'slate';

const plugins = [createCapitalisePlugin('some user')];

const createEditor = (value: string) =>
  createPlateEditor<KabalValue, (typeof plugins)[0]>({
    plugins,
    value: [createSimpleParagraph(value)],
    selection: createSelection({ path: [0, 0], offset: value.length }),
  });

const createSelection = (point: Point): Selection => ({ anchor: point, focus: point });

describe('capitalise', () => {
  beforeAll(() => {
    mock.module('@app/hooks/settings/manager', () => ({
      SETTINGS_MANAGER: {
        get: () => 'true',
      },
    }));
  });

  afterAll(() => {
    mock.module('@app/hooks/settings/manager', () => originalSettingsManager);
  });

  describe('typing / pasting plaintext', () => {
    it('should capitalise when typing after sentences ending with "."', () => {
      const editor = createEditor('Old sentence.');
      type(editor, ' new sentence.');

      expect(editor.api.string([])).toEqual('Old sentence. New sentence.');
    });

    it('should capitalise when typing after sentences ending with "!"', () => {
      const editor = createEditor('Old sentence!');
      type(editor, ' new sentence.');

      expect(editor.api.string([])).toEqual('Old sentence! New sentence.');
    });

    it('should capitalise when typing after sentences ending with "?"', () => {
      const editor = createEditor('Old sentence?');
      type(editor, ' new sentence.');

      expect(editor.api.string([])).toEqual('Old sentence? New sentence.');
    });

    it('should capitalise when pasting single plain-text lowercase words', () => {
      const editor = createEditor('Old sentence. ');
      editor.tf.insertText('new');

      expect(editor.api.string([])).toEqual('Old sentence. New');

      editor.tf.insertText('? ');
      editor.tf.insertText('with-dash');

      expect(editor.api.string([])).toEqual('Old sentence. New? With-dash');
    });

    it('should not capitalise when pasted word if not completely lower-case', () => {
      const editor = createEditor('Old sentence. ');
      editor.tf.insertText('iPhone');

      expect(editor.api.string([])).toEqual('Old sentence. iPhone');
    });

    it('should not capitalise when pasted word contains special characters', () => {
      const editor = createEditor('Old sentence. ');
      editor.tf.insertText('www.example.com');

      expect(editor.api.string([])).toEqual('Old sentence. www.example.com');
    });

    it('should capitalise if at start of a new block', () => {
      const pEditor = createEditor('');
      pEditor.tf.insertText('start');

      expect(pEditor.children).toEqual([
        {
          type: BaseParagraphPlugin.key,
          align: TextAlign.LEFT,
          children: [{ text: 'S', autoCapitalised: true }, { text: 'tart' }],
        },
      ]);
    });

    it('should capitalise if at start of a new block (heading 1)', () => {
      const editor = createPlateEditor({
        plugins: [createCapitalisePlugin('some user')],
        value: [createHeadingOne('')],
        selection: createSelection({ path: [0, 0], offset: 0 }),
      });

      editor.tf.insertText('start');

      expect(editor.children).toEqual([
        { type: BaseH1Plugin.key, children: [{ text: 'S', autoCapitalised: true }, { text: 'tart' }] },
      ]);
    });

    it('should not capitalise after ordinals', () => {
      const editor = createEditor('Klæbo kom på 1. ');
      editor.tf.insertText('plass');

      expect(editor.api.string([])).toEqual('Klæbo kom på 1. plass');
    });

    it('should not capitalise after abbreviatons', () => {
      const editor = createEditor('Han er født 22. okt. ');
      editor.tf.insertText('nitten nittiseks');

      expect(editor.api.string([])).toEqual('Han er født 22. okt. nitten nittiseks');
    });

    it('should uncapitalise if backspace is pressed after typing', () => {
      const editor = createEditor('Old sentence. ');

      editor.tf.insertText('n');
      expect(editor.api.string([])).toEqual('Old sentence. N');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. n');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. ');
    });

    it('should let user use backspace normally after capitalised char', () => {
      const editor = createEditor('Old sentence. ');
      type(editor, 'new');
      expect(editor.api.string([])).toEqual('Old sentence. New');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. Ne');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. N');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. n');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. ');
    });

    it('should uncapitalise if backspace is pressed after pasting plaintext', () => {
      const editor = createEditor('Old sentence. ');

      editor.tf.insertText('new');
      expect(editor.api.string([])).toEqual('Old sentence. New');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. Ne');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. N');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. n');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. ');
    });

    it('should let user use backspace normally pasting auto-capitalised plaintext', () => {
      const editor = createEditor('Old sentence. ');
      editor.tf.insertText('new');
      expect(editor.api.string([])).toEqual('Old sentence. New');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. Ne');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. N');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. n');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. ');
    });

    it('should work in redigerbar maltekst inside maltekstseksjon', () => {
      const redigerbarMaltekst = createRedigerbarMaltekst(TemplateSections.ANFOERSLER, [
        createSimpleParagraph('Hello'),
        createSimpleParagraph(''),
      ]);
      const maltekstseksjon = createMaltekstseksjon(TemplateSections.ANFOERSLER, 'id', [], [redigerbarMaltekst]);

      const editor = createPlateEditor<KabalValue, (typeof plugins)[0]>({
        plugins,
        value: [maltekstseksjon],
        selection: createSelection({ path: [0, 0, 1, 0], offset: 0 }),
      });

      type(editor, 'world');

      expect(editor.children).toEqual([
        createMaltekstseksjon(
          TemplateSections.ANFOERSLER,
          'id',
          [],
          [
            createRedigerbarMaltekst(TemplateSections.ANFOERSLER, [
              createSimpleParagraph('Hello'),
              {
                type: BaseParagraphPlugin.key,
                align: TextAlign.LEFT,
                children: [{ text: 'W', autoCapitalised: true }, { text: 'orld' }],
              },
            ]),
          ],
        ),
      ]);
    });
  });

  describe('fragment', () => {
    it('should capitalise after senctences when pasting from smart editor', () => {
      const editor = createEditor('Old sentence. ');
      editor.tf.insertFragment([createSimpleParagraph('new')]);

      expect(editor.api.string([])).toEqual('Old sentence. New');
    });

    it('should capitalise at start of blocks when pasting from smart editor', () => {
      const editor = createEditor('');
      editor.tf.insertFragment([createSimpleParagraph('new')]);

      expect(editor.api.string([])).toEqual('New');
    });

    it('should not capitalise at start of blocks when pasting multiple blocks', () => {
      const editor = createEditor('');
      editor.tf.insertFragment([createSimpleParagraph('hello'), createSimpleParagraph('world')]);

      expect(editor.children).toEqual([createSimpleParagraph('hello'), createSimpleParagraph('world')]);
    });

    it('should not capitalise if block contains multiple words', () => {
      const editor = createEditor('');
      editor.tf.insertFragment([createSimpleParagraph('hello world')]);

      expect(editor.api.string([])).toEqual('hello world');
    });

    it('should capitalise if block contains multiple text nodes that form one single word', () => {
      const editor = createEditor('');

      const paragraph: ParagraphElement = {
        type: BaseParagraphPlugin.key,
        align: TextAlign.LEFT,
        children: [{ text: 'hello' }, { text: 'world' }],
      };

      editor.tf.insertFragment([paragraph]);

      expect(editor.api.string([])).toEqual('Helloworld');
    });

    it('should not capitalise if block contains multiple text nodes that form more than one word', () => {
      const editor = createEditor('');

      const paragraph: ParagraphElement = {
        type: BaseParagraphPlugin.key,
        align: TextAlign.LEFT,
        children: [{ text: 'hello' }, { text: ' world' }],
      };

      editor.tf.insertFragment([paragraph]);

      expect(editor.api.string([])).toEqual('hello world');
    });

    it('should not capitalise if block contains multiple text nodes that consist only of space', () => {
      const editor = createEditor('');

      const paragraph: ParagraphElement = {
        type: BaseParagraphPlugin.key,
        align: TextAlign.LEFT,
        children: [{ text: 'hello' }, { text: ' ' }, { text: 'world' }],
      };

      editor.tf.insertFragment([paragraph]);

      expect(editor.api.string([])).toEqual('hello world');
    });

    it('should not capitalise when pasting nested multiple blocks', () => {
      const editor = createEditor('');

      editor.tf.insertFragment([
        createRedigerbarMaltekst(TemplateSections.ANFOERSLER, [
          createSimpleParagraph('hello'),
          createSimpleParagraph('world'),
        ]),
      ]);

      expect(editor.children).toEqual([
        createRedigerbarMaltekst(TemplateSections.ANFOERSLER, [
          createSimpleParagraph('hello'),
          createSimpleParagraph('world'),
        ]),
      ]);
    });

    it('should uncapitalise if backspace is pressed after pasting fragment from smart-editor', () => {
      const editor = createEditor('Old sentence. ');

      editor.tf.insertFragment([createSimpleParagraph('new')]);
      expect(editor.api.string([])).toEqual('Old sentence. New');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. Ne');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. N');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. n');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. ');
    });

    it('should let user use backspace normally pasting auto-capitalised fragment from smart-editor', () => {
      const editor = createEditor('Old sentence. ');

      editor.tf.insertFragment([createSimpleParagraph('new')]);
      expect(editor.api.string([])).toEqual('Old sentence. New');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. Ne');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. N');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. n');

      editor.tf.deleteBackward('character');
      expect(editor.api.string([])).toEqual('Old sentence. ');
    });
  });
});

const type = (editor: PlateEditor, text: string) => {
  for (const char of text) {
    editor.tf.insertText(char);
  }
};
