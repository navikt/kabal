import { Editor, Text, Transforms } from 'slate';
import { isNotUndefined } from '../../../../../../functions/is-not-type-guards';

export const removeTab = (editor: Editor) => {
  const textNodeEntries = Editor.nodes(editor, {
    match: Text.isText,
    reverse: true,
  });

  const [[textNode, textPath]] = textNodeEntries;

  if (Text.matches(textNode, { text: '\t' })) {
    const indexes = textNode.text
      .split('')
      .map((char, index) => (char === '\t' ? index : undefined))
      .filter(isNotUndefined);

    const offset = indexes.find((index) => index + 1 === (editor.selection?.focus.offset ?? 1));

    if (typeof offset !== 'number') {
      return;
    }

    Transforms.delete(editor, {
      at: { path: [...textPath], offset },
      unit: 'character',
      distance: 1,
    });
  }
};

export const addTab = (editor: Editor) => Transforms.insertText(editor, '\t');
