import { describe, expect, it } from 'bun:test';
import { createPlateEditor } from 'platejs/react';
import { IS_MAC, Keys } from '@/keys';
import { CleanupDocumentPlugin } from '@/plate/plugins/cleanup/cleanup-document';
import { WhitespaceDecorationPlugin } from '@/plate/plugins/whitespace-decoration';
import { createSimpleParagraph } from '@/plate/templates/helpers';

const plugins = [WhitespaceDecorationPlugin, CleanupDocumentPlugin];

const createEditor = (...paragraphs: string[]) =>
  createPlateEditor({
    plugins,
    value: paragraphs.map((p) => createSimpleParagraph(p)),
  });

const simulateCtrlK = (editor: ReturnType<typeof createEditor>) => {
  let prevented = false;
  const event = {
    key: Keys.K,
    metaKey: IS_MAC,
    ctrlKey: !IS_MAC,
    shiftKey: false,
    altKey: false,
    preventDefault: () => {
      prevented = true;
    },
    persist: () => undefined,
  } as unknown as KeyboardEvent;

  for (const plugin of editor.meta.pluginList) {
    plugin.handlers?.onKeyDown?.({
      editor,
      event,
    } as Parameters<NonNullable<typeof plugin.handlers.onKeyDown>>[0]);
  }

  return prevented;
};

describe('cleanup document (Ctrl+K)', () => {
  it('should collapse double spaces', () => {
    const editor = createEditor('Hello  world');
    simulateCtrlK(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should collapse double spaces across multiple paragraphs', () => {
    const editor = createEditor('Hello  world', 'Foo  bar');
    simulateCtrlK(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world'), createSimpleParagraph('Foo bar')]);
  });

  it('should prevent the default browser Ctrl/Cmd+K behavior', () => {
    const editor = createEditor('Hello  world');
    const prevented = simulateCtrlK(editor);
    expect(prevented).toBe(true);
  });

  it('should be undoable', () => {
    const editor = createEditor('Hello  world');
    simulateCtrlK(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
    editor.tf.undo();
    expect(editor.children).toEqual([createSimpleParagraph('Hello  world')]);
  });

  it('should not modify text without double spaces', () => {
    const editor = createEditor('Hello world');
    simulateCtrlK(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should normalize NBSP then collapse resulting double spaces', () => {
    const editor = createEditor('Hello\u00A0 world');
    simulateCtrlK(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should trim leading and trailing whitespace', () => {
    const editor = createEditor('  Hello world  ');
    simulateCtrlK(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello world')]);
  });

  it('should remove space before punctuation', () => {
    const editor = createEditor('Hello .');
    simulateCtrlK(editor);
    expect(editor.children).toEqual([createSimpleParagraph('Hello.')]);
  });

  it('should apply all cleanup steps in sequence', () => {
    const editor = createEditor('  Hello\u00A0 world .  ', '', '');
    simulateCtrlK(editor);
    expect(editor.children).toEqual([
      createSimpleParagraph('Hello world.'),
      createSimpleParagraph(''),
      createSimpleParagraph(''),
    ]);
  });
});
