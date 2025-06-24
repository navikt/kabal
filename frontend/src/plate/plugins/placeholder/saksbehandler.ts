import { isMetaKey } from '@app/keys';
import { SaksbehandlerPlaceholder } from '@app/plate/components/placeholder/placeholder';
import { handleArrows } from '@app/plate/plugins/placeholder/arrows';
import { parsers } from '@app/plate/plugins/placeholder/html-parsers';
import { handleSelectAll } from '@app/plate/plugins/placeholder/select-all';
import { type PlateEditor, createPlatePlugin } from '@platejs/core/react';
import { ElementApi, type NodeEntry } from 'platejs';
import type { BasePoint } from 'slate';
import type { PlaceholderElement } from '../../types';
import { ELEMENT_PLACEHOLDER } from '../element-types';
import { withOverrides } from './with-overrides';

export const SaksbehandlerPlaceholderPlugin = createPlatePlugin({
  key: ELEMENT_PLACEHOLDER,
  node: {
    isElement: true,
    isVoid: false,
    isInline: true,
    component: SaksbehandlerPlaceholder,
  },
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (handleSelectAll(editor, event) || handleArrows(editor, event)) {
        return;
      }

      if (isMetaKey(event) && event.key.toLowerCase() === 'j') {
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
