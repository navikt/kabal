import { createEmptyVoid } from '@app/plate/templates/helpers';
import type { MaltekstElement, MaltekstseksjonElement, RedigerbarMaltekstElement } from '@app/plate/types';
import {
  replaceNodeChildren,
  setNodes,
  unsetNodes,
  withoutNormalizing,
  withoutSavingHistory,
} from '@udecode/plate-common';
import type { PlateEditor } from '@udecode/plate-core/react';
import type { Path } from 'slate';

export const replaceNodes = (
  editor: PlateEditor,
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
