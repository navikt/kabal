import { ElementApi, type NodeEntry } from 'platejs';
import { createPlatePlugin, type PlateEditor } from 'platejs/react';
import type { BasePoint } from 'slate';
import { isMetaKey, Keys } from '@/keys';
import { SaksbehandlerPlaceholder } from '@/plate/components/placeholder/placeholder';
import { ELEMENT_PLACEHOLDER } from '@/plate/plugins/element-types';
import { handleNavigation } from '@/plate/plugins/placeholder/handle-navigation';
import { parsers } from '@/plate/plugins/placeholder/html-parsers';
import { handleSelectAll } from '@/plate/plugins/placeholder/select-all';
import { withOverrides } from '@/plate/plugins/placeholder/with-overrides';
import type { PlaceholderElement } from '@/plate/types';

export const SaksbehandlerPlaceholderPlugin = createPlatePlugin({
  key: ELEMENT_PLACEHOLDER,
  node: {
    isElement: true,
    isVoid: false,
    isInline: true,
    component: SaksbehandlerPlaceholder,
  },
  rules: { selection: { affinity: 'directional' } }, // Makes it possible to place the caret at the edges of the placeholder in Chrome.
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (handleSelectAll(editor, event)) {
        return;
      }

      if (handleNavigation(editor, event)) {
        return true; // Prevent further handling
      }

      if (isMetaKey(event) && event.key.toLowerCase() === Keys.J) {
        event.preventDefault();
        event.stopPropagation();

        const current = editor.api.node({ match: { type: ELEMENT_PLACEHOLDER } });
        const getEntry = event.shiftKey ? editor.api.previous : editor.api.next;

        const nextOrPrevious = getEntry<PlaceholderElement>({
          match: (n) => ElementApi.isElement(n) && n.type === ELEMENT_PLACEHOLDER && n !== current?.[0],
        });

        if (nextOrPrevious !== undefined) {
          return selectAndScrollIntoView(editor, nextOrPrevious);
        }

        const firstOrLast = editor.api.node<PlaceholderElement>({
          match: { type: ELEMENT_PLACEHOLDER },
          at: [],
          reverse: event.shiftKey,
        });

        if (firstOrLast !== undefined) {
          return selectAndScrollIntoView(editor, firstOrLast);
        }
      }
    },
  },
  parsers,
}).overrideEditor(withOverrides);

const selectAndScrollIntoView = (editor: PlateEditor, [node, path]: NodeEntry<PlaceholderElement>) => {
  const lastIndex = node.children.length - 1;
  const offset = node.children[lastIndex]?.text.length ?? 0;
  const point: BasePoint = { path: [...path, lastIndex], offset };

  editor.tf.select(point);
  editor.api.toDOMNode(node)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
