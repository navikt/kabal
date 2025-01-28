import { SaksbehandlerPlaceholder } from '@app/plate/components/placeholder/placeholder';
import { handleArrows } from '@app/plate/plugins/placeholder/arrows';
import { parsers } from '@app/plate/plugins/placeholder/html-parsers';
import { handleSelectAll } from '@app/plate/plugins/placeholder/select-all';
import { type TNodeEntry, findNode, getNextNode, getPreviousNode, isElement, select } from '@udecode/plate-common';
import { type PlateEditor, createPlatePlugin } from '@udecode/plate-core/react';
import { toDOMNode } from '@udecode/slate-react';
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
  extendEditor: ({ editor }) => withOverrides(editor),
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (handleSelectAll(editor, event) || handleArrows(editor, event)) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'j') {
        event.preventDefault();
        event.stopPropagation();

        const current = findNode(editor, { match: { type: ELEMENT_PLACEHOLDER } });
        const getEntry = event.shiftKey ? getPreviousNode : getNextNode;

        const nextOrPrevious = getEntry<PlaceholderElement>(editor, {
          match: (n) => isElement(n) && n.type === ELEMENT_PLACEHOLDER && n !== current?.[0],
        });

        if (nextOrPrevious !== undefined) {
          return selectAndScrollIntoView(editor, nextOrPrevious);
        }

        const firstOrLast = findNode<PlaceholderElement>(editor, {
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
});

const selectAndScrollIntoView = (editor: PlateEditor, [node, path]: TNodeEntry<PlaceholderElement>) => {
  const lastIndex = node.children.length - 1;
  const offset = node.children[lastIndex]?.text.length ?? 0;
  const point: BasePoint = { path: [...path, lastIndex], offset };

  select(editor, point);
  toDOMNode(editor, node)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
