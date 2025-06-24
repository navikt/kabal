import { Regelverk, RegelverkContainer } from '@app/plate/components/regelverk';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { createPlatePlugin } from '@platejs/core/react';
import { ElementApi, type NodeEntry } from 'platejs';
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
}).overrideEditor(({ editor }) => {
  const { normalizeNode } = editor.tf;

  editor.tf.normalizeNode = ([node, path]: NodeEntry) => {
    if (node.type === ELEMENT_REGELVERK_CONTAINER && ElementApi.isElement(node) && editor.api.isEmpty(node)) {
      return editor.tf.insertNodes(createSimpleParagraph(), { select: true, at: [...path, 0] });
    }

    normalizeNode([node, path]);
  };

  return editor;
});
