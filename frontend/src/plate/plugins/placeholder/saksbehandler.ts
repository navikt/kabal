import { isMetaKey } from '@app/keys';
import { SaksbehandlerPlaceholder } from '@app/plate/components/placeholder/placeholder';
import { handleArrows } from '@app/plate/plugins/placeholder/arrows';
import { parsers } from '@app/plate/plugins/placeholder/html-parsers';
import { isPlaceholderInMaltekst } from '@app/plate/plugins/placeholder/queries';
import { handleSelectAll } from '@app/plate/plugins/placeholder/select-all';
import { isOfElementType } from '@app/plate/utils/queries';
import { createPlatePlugin, type PlateEditor } from '@platejs/core/react';
import { ElementApi, NodeApi, type NodeEntry, TextApi } from 'platejs';
import type { BasePoint } from 'slate';
import type { PlaceholderElement } from '../../types';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '../element-types';
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

      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();

        const current = editor.api.node({ match: { type: ELEMENT_PLACEHOLDER } });
        if (current === undefined) {
          return;
        }

        const [, currentPath] = current;

        // Find and go to next editable node.

        const next = editor.api.next({
          at: currentPath,
          mode: 'lowest',
          match: (n, p) => {
            if (!TextApi.isText(n)) {
              return false;
            }

            isPlaceholderInMaltekst;

            const ancestors = NodeApi.ancestors(editor, p);

            for (const [ancestor] of ancestors) {
              if (isOfElementType(ancestor, ELEMENT_MALTEKST)) {
                return false;
              }
            }

            return true;
          },
        });

        if (next === undefined) {
          return;
        }

        const [_nextNode, nextPath] = next;

        const nextStartPoint = editor.api.start(nextPath);

        if (nextStartPoint === undefined) {
          return;
        }

        editor.tf.select(nextStartPoint, { next: true });

        console.table({
          currentPath: currentPath.join(','),
          nextStartPointPath: nextStartPoint.path.join(','),
          nextStartPointOffset: nextStartPoint.offset,
          path: editor.selection?.focus.path.join(','),
          offset: editor.selection?.focus.offset,
          node: JSON.stringify(editor.api.node({ at: editor.selection?.focus, mode: 'lowest' })?.[0], null, 2),
        });

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
