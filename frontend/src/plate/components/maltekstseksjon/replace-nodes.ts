import { createEmptyVoid } from '@app/plate/templates/helpers';
import type { MaltekstElement, MaltekstseksjonElement, RedigerbarMaltekstElement } from '@app/plate/types';
import type { PlateEditor } from '@udecode/plate-core/react';
import type { Path } from 'slate';

export const replaceNodes = (
  editor: PlateEditor,
  path: Path | undefined,
  id: string | null,
  textIdList: string[] | null,
  nodes: (MaltekstElement | RedigerbarMaltekstElement)[] | null,
) => {
  if (path === undefined || !editor.api.hasPath(path)) {
    return;
  }

  editor.tf.withoutSaving(() => {
    editor.tf.withoutNormalizing(() => {
      if (id === null) {
        editor.tf.unsetNodes<MaltekstseksjonElement>('id', { at: path });
      } else {
        editor.tf.setNodes<MaltekstseksjonElement>({ id }, { at: path });
      }

      if (textIdList === null) {
        editor.tf.unsetNodes<MaltekstseksjonElement>('textIdList', { at: path });
      } else {
        editor.tf.setNodes<MaltekstseksjonElement>({ textIdList }, { at: path });
      }

      if (nodes === null) {
        editor.tf.replaceNodes([createEmptyVoid()], { at: path, children: true });
      } else {
        editor.tf.replaceNodes(nodes, { at: path, children: true });
      }
    });
  });
};
