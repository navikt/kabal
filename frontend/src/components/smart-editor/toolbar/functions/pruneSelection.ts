import { Editor, Range, Selection, Text } from 'slate';

export const pruneSelection = (editor: Editor): Selection => {
  if (editor.selection === null || Range.isCollapsed(editor.selection)) {
    return editor.selection;
  }

  editor.selection = Editor.unhangRange(editor, editor.selection);

  const nodeGenerator = Editor.nodes(editor, {
    at: editor.selection,
    match: Text.isText,
  });
  const nodes = Array.from(nodeGenerator);

  if (nodes.length > 1) {
    let [focus, anchor] = Range.edges(editor.selection);
    const [[firstNode]] = nodes;

    if (firstNode.text.length === focus.offset) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        1: [_, secondPath],
      } = nodes;
      focus = {
        offset: 0,
        path: secondPath,
      };
    }

    if (anchor.offset === 0) {
      const [secondLastNode, secondLastPath] = nodes[nodes.length - 2];
      anchor = {
        offset: secondLastNode.text.length,
        path: secondLastPath,
      };
    }

    return { focus, anchor };
  }

  return editor.selection;
};
