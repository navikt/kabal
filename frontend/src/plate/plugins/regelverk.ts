import { TNodeEntry, createPluginFactory, insertElements, isElement, isElementEmpty } from '@udecode/plate-common';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { EditorValue, RegelverkContainerElement, RegelverkElement, RichTextEditor } from '@app/plate/types';
import { ELEMENT_REGELVERK, ELEMENT_REGELVERK_CONTAINER } from './element-types';

export const createRegelverkPlugin = createPluginFactory<RegelverkElement, EditorValue>({
  key: ELEMENT_REGELVERK,
  isElement: true,
  isVoid: false,
  isInline: false,
});

export const createRegelverkContainerPlugin = createPluginFactory<RegelverkContainerElement, EditorValue>({
  key: ELEMENT_REGELVERK_CONTAINER,
  isElement: true,
  withOverrides: (editor: RichTextEditor) => {
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
