import { AnyObject, PlateEditor, createPluginFactory, someNode } from '@udecode/plate';
import { EditorFragmentDeletionOptions, TextUnit } from 'slate';
import { TextDeleteOptions } from 'slate/dist/interfaces/transforms/text';
import { EditorValue, RichTextEditor } from '@app/components/plate-editor/types';

export const ELEMENT_MALTEKST = 'maltekst';

const maltekstInSelection = (editor: RichTextEditor) => someNode(editor, { match: { type: ELEMENT_MALTEKST } });

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
