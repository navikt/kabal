import { createPlatePlugin, type PlateEditor } from 'platejs/react';
import { isMetaKey, Keys } from '@/keys';
import { cleanupWhitespaceIssues } from '@/plate/plugins/cleanup/cleanup-whitespace';
import { normalizeNonStandardSpaces } from '@/plate/plugins/cleanup/normalize-non-standard-spaces';

export const CleanupDocumentPlugin = createPlatePlugin({
  key: 'cleanup-document',
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (event.key.toLowerCase() === Keys.K && isMetaKey(event) && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        cleanupDocument(editor);
      }
    },
  },
});

/** Clean up the document. Triggered by Ctrl/Cmd+K. Undoable. */
export const cleanupDocument = (editor: PlateEditor): void => {
  editor.tf.withoutNormalizing(() => {
    normalizeNonStandardSpaces(editor);
    cleanupWhitespaceIssues(editor);
  });

  editor.tf.normalize({ force: true });
};
