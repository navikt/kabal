import { Regelverk, RegelverkContainer } from '@app/plate/components/regelverk';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { type TNodeEntry, insertElements, isElement, isElementEmpty } from '@udecode/plate-common';
import { createPlatePlugin } from '@udecode/plate-core/react';
import { ELEMENT_REGELVERK, ELEMENT_REGELVERK_CONTAINER } from './element-types';

export const RegelverkPlugin = createPlatePlugin({
  key: ELEMENT_REGELVERK,
  node: {
    isElement: true,
    isVoid: false,
    isInline: false,
    component: Regelverk,
  },
});

export const RegelverkContainerPlugin = createPlatePlugin({
  key: ELEMENT_REGELVERK_CONTAINER,
  node: {
    isElement: true,
    component: RegelverkContainer,
  },
  extendEditor: ({ editor }) => {
    const { normalizeNode } = editor;

    editor.normalizeNode = ([node, path]: TNodeEntry) => {
      if (node.type === ELEMENT_REGELVERK_CONTAINER) {
        if (isElement(node) && isElementEmpty(editor, node)) {
          return insertElements(editor, createSimpleParagraph(), { select: true, at: [...path, 0] });
        }
      }

      normalizeNode([node, path]);
    };

    return editor;
  },
});
