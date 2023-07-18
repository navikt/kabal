import { Editor, Range, Text, Transforms } from 'slate';

interface LineStart {
  startOffset: number;
  text: string;
}

export const removeTabs = (editor: Editor) => {
  const textNodeEntries = Editor.nodes(editor, {
    match: Text.isText,
    reverse: true,
  });

  Editor.withoutNormalizing(editor, () => {
    for (const [textNode, textPath] of textNodeEntries) {
      const lines = textNode.text.split('\n');

      lines
        .reduce<LineStart[]>((acc, line, i) => {
          if (i === 0) {
            return [{ startOffset: 0, text: line }];
          }

          const [previous] = acc;

          if (previous === undefined) {
            return acc;
          }

          return [
            {
              startOffset: previous.startOffset + (previous.text.length + 1),
              text: line,
            },
            ...acc,
          ];
        }, [])
        .filter(({ text }) => text.startsWith('\t'))
        .forEach((line) =>
          Transforms.delete(editor, {
            at: { path: textPath, offset: line.startOffset },
            unit: 'character',
            distance: 1,
          }),
        );
    }
  });
};

export const addTabs = (editor: Editor) => {
  if (editor.selection === null) {
    return;
  }

  const textNodeEntries = Editor.nodes(editor, {
    match: Text.isText,
    reverse: true,
  });

  Editor.withoutNormalizing(editor, () => {
    for (const [textNode, textPath] of textNodeEntries) {
      const lines = textNode.text.split('\n');

      lines
        .reduce<LineStart[]>((acc, line, i) => {
          if (i === 0) {
            return [{ startOffset: 0, text: line }];
          }

          const [previous] = acc;

          if (previous === undefined) {
            return acc;
          }

          return [
            {
              startOffset: previous.startOffset + (previous.text.length + 1),
              text: line,
            },
            ...acc,
          ];
        }, [])
        .forEach(({ startOffset }) => {
          Transforms.insertText(editor, '\t', {
            at: { path: textPath, offset: startOffset },
          });

          if (editor.selection === null) {
            return;
          }

          const start = Range.start(editor.selection);
          const end = Range.end(editor.selection);

          if (Range.isBackward(editor.selection)) {
            Transforms.setSelection(editor, {
              focus: { ...start, offset: 0 },
              anchor: end,
            });

            return;
          }

          Transforms.setSelection(editor, {
            focus: end,
            anchor: { ...start, offset: 0 },
          });
        });
    }
  });
};
