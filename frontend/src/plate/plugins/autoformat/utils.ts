import type { AutoformatBlockRule } from '@platejs/autoformat';
import { toggleList, unwrapList } from '@platejs/list-classic';
import { ElementApi, type SlateEditor } from 'platejs';

export const preFormat: AutoformatBlockRule['preFormat'] = (editor) => unwrapList(editor);

const format = (editor: SlateEditor, customFormatting: () => void) => {
  if (editor.selection) {
    const parentEntry = editor.api.parent(editor.selection);

    if (!parentEntry) {
      return;
    }
    const [node] = parentEntry;

    if (ElementApi.isElement(node)) {
      customFormatting();
    }
  }
};

export const formatList = (editor: SlateEditor, elementType: string) => {
  format(editor, () =>
    toggleList(editor, {
      type: elementType,
    }),
  );
};
