import { AnyObject, PlateEditor, createPluginFactory, someNode } from '@udecode/plate';
import { EditorFragmentDeletionOptions, TextUnit } from 'slate';
import { TextDeleteOptions } from 'slate/dist/interfaces/transforms/text';
import { ELEMENT_MALTEKST } from '@app/components/plate-editor/plugins/element-types';
import { EditorValue, RichTextEditor } from '@app/components/plate-editor/types';

const maltekstInSelection = (editor: RichTextEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  return someNode(editor, { match: { type: ELEMENT_MALTEKST, at: editor.selection } });
};

const withOverrides = (editor: PlateEditor<EditorValue>) => {
  const { deleteBackward, deleteForward, deleteFragment, delete: deleteFn } = editor;

  editor.deleteBackward = (unit: TextUnit) => {
    if (maltekstInSelection(editor)) {
      return;
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit: TextUnit) => {
    if (maltekstInSelection(editor)) {
      return;
    }

    deleteForward(unit);
  };

  editor.deleteFragment = (options: EditorFragmentDeletionOptions | undefined) => {
    if (maltekstInSelection(editor)) {
      return;
    }

    deleteFragment(options);
  };

  editor.delete = (options: TextDeleteOptions | undefined) => {
    if (maltekstInSelection(editor)) {
      return;
    }

    deleteFn(options);
  };

  return editor;
};

export const createMaltekstPlugin = createPluginFactory<AnyObject, EditorValue, RichTextEditor>({
  key: ELEMENT_MALTEKST,
  isElement: true,
  isVoid: true,
  withOverrides,
});
