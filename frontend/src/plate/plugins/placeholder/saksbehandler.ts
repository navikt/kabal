import {
  PlateEditor,
  TNodeEntry,
  createPluginFactory,
  findNode,
  getNextNode,
  getPreviousNode,
  isElement,
  select,
  toDOMNode,
} from '@udecode/plate-common';
import { BasePoint } from 'slate';
import { handleArrows } from '@app/plate/plugins/placeholder/arrows';
import { handleSelectAll } from '@app/plate/plugins/placeholder/select-all';
import { PlaceholderElement } from '../../types';
import { ELEMENT_PLACEHOLDER } from '../element-types';
import { withOverrides } from './with-overrides';

export const createSaksbehandlerPlaceholderPlugin = createPluginFactory({
  key: ELEMENT_PLACEHOLDER,
  isElement: true,
  isVoid: false,
  isInline: true,
  withOverrides,
  handlers: {
    onKeyDown: (editor) => (e) => {
      if (handleSelectAll(editor, e) || handleArrows(editor, e)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        e.stopPropagation();

        const current = findNode(editor, { match: { type: ELEMENT_PLACEHOLDER } });
        const getEntry = e.shiftKey ? getPreviousNode : getNextNode;

        const nextOrPrevious = getEntry<PlaceholderElement>(editor, {
          match: (n) => isElement(n) && n.type === ELEMENT_PLACEHOLDER && n !== current?.[0],
        });

        if (nextOrPrevious !== undefined) {
          return selectAndScrollIntoView(editor, nextOrPrevious);
        }

        const firstOrLast = findNode<PlaceholderElement>(editor, {
          match: { type: ELEMENT_PLACEHOLDER },
          at: [],
          reverse: e.shiftKey,
        });

        if (firstOrLast !== undefined) {
          return selectAndScrollIntoView(editor, firstOrLast);
        }
      }
    },
  },
});

const selectAndScrollIntoView = (editor: PlateEditor, [node, path]: TNodeEntry<PlaceholderElement>) => {
  const lastIndex = node.children.length - 1;
  const offset = node.children[lastIndex]?.text.length ?? 0;
  const point: BasePoint = { path: [...path, lastIndex], offset };

  select(editor, point);
  toDOMNode(editor, node)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
