import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { type TNodeEntry, createPluginFactory, insertElements, isElement, isElementEmpty } from '@udecode/plate-common';
import { ELEMENT_REGELVERK, ELEMENT_REGELVERK_CONTAINER } from './element-types';

export const createRegelverkPlugin = createPluginFactory({
  key: ELEMENT_REGELVERK,
  isElement: true,
  isVoid: false,
  isInline: false,
});

export const createRegelverkContainerPlugin = createPluginFactory({
  key: ELEMENT_REGELVERK_CONTAINER,
  isElement: true,
  withOverrides: (editor) => {
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
