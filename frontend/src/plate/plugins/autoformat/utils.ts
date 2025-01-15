import { ElementApi, type SlateEditor } from '@udecode/plate';
import type { AutoformatBlockRule } from '@udecode/plate-autoformat';
import { toggleList, unwrapList } from '@udecode/plate-list';

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
