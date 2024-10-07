import {
  PlateEditor,
  replaceNodeChildren,
  setNodes,
  unsetNodes,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import { Path } from 'slate';
import { createEmptyVoid } from '@app/plate/templates/helpers';
import { EditorValue, MaltekstElement, MaltekstseksjonElement, RedigerbarMaltekstElement } from '@app/plate/types';

export const replaceNodes = (
  editor: PlateEditor<EditorValue>,
  path: Path | undefined,
  id: string | null,
  textIdList: string[] | null,
  nodes: (MaltekstElement | RedigerbarMaltekstElement)[] | null,
) => {
  if (path === undefined || !editor.hasPath(path)) {
    return;
  }

  withoutSavingHistory(editor, () => {
    withoutNormalizing(editor, () => {
      if (id === null) {
        unsetNodes<MaltekstseksjonElement>(editor, 'id', { at: path });
      } else {
        setNodes<MaltekstseksjonElement>(editor, { id }, { at: path });
      }

      if (textIdList === null) {
        unsetNodes<MaltekstseksjonElement>(editor, 'textIdList', { at: path });
      } else {
        setNodes<MaltekstseksjonElement>(editor, { textIdList }, { at: path });
      }

      if (nodes === null) {
        replaceNodeChildren(editor, { at: path, nodes: [createEmptyVoid()] });
      } else {
        replaceNodeChildren(editor, { at: path, nodes });
      }
    });
  });
};
