import { Editor, Range, Selection, Text } from 'slate';

export const pruneSelection = (editor: Editor): Selection => {
  if (editor.selection === null || Range.isCollapsed(editor.selection)) {
    return editor.selection;
  }

  const nodeGenerator = Editor.nodes(editor, {
    at: editor.selection,
    match: Text.isText,
  });
  const nodeEntries = Array.from(nodeGenerator);

  if (nodeEntries.length > 1) {
    const [firstEntry] = nodeEntries;

    if (firstEntry === undefined) {
      return editor.selection;
    }

    const [firstNode] = firstEntry;

    let [focus, anchor] = Range.edges(editor.selection);

    if (firstNode.text.length === focus.offset) {
      const [, secondEntry] = nodeEntries;

      if (secondEntry !== undefined) {
        const [, secondPath] = secondEntry;

        focus = {
          offset: 0,
          path: secondPath,
        };
      }
    }

    if (anchor.offset === 0) {
      const secondLastEntry = nodeEntries[nodeEntries.length - 2];

      if (secondLastEntry !== undefined) {
        const [secondLastNode, secondLastPath] = secondLastEntry;
        anchor = {
          offset: secondLastNode.text.length,
          path: secondLastPath,
        };
      }
    }

    return { focus, anchor };
  }

  return editor.selection;
};
