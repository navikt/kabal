import { Editor, Path, Range, Text, Transforms } from 'slate';
import { getFlettefeltPath } from './flettefelt';

export const moveRight = (editor: Editor, event?: React.KeyboardEvent) => {
  const flettefeltPath = getFlettefeltPath(editor);

  if (flettefeltPath === null) {
    if (editor.selection !== null && Range.isCollapsed(editor.selection)) {
      event?.preventDefault();
      Transforms.move(editor, { unit: 'offset', reverse: false });
    }

    return;
  }

  const nextPath = Path.next(flettefeltPath);
  const [nextNodeEntry] = Editor.nodes<Text>(editor, { match: Text.isText, at: nextPath });

  if (nextNodeEntry === undefined) {
    return;
  }

  const [, textPath] = nextNodeEntry;

  event?.preventDefault();

  Transforms.select(editor, {
    path: textPath,
    offset: 0,
  });
};

export const moveLeft = (editor: Editor, event?: React.KeyboardEvent) => {
  const flettefeltPath = getFlettefeltPath(editor);

  if (flettefeltPath === null) {
    if (editor.selection !== null && Range.isCollapsed(editor.selection)) {
      event?.preventDefault();
      Transforms.move(editor, { unit: 'offset', reverse: true });
    }

    return;
  }

  const prevPath = Path.previous(flettefeltPath);
  const [prevNodeEntry] = Editor.nodes<Text>(editor, { match: Text.isText, at: prevPath });

  if (prevNodeEntry === undefined) {
    return;
  }

  const [textNode, textPath] = prevNodeEntry;

  event?.preventDefault();

  Transforms.select(editor, {
    path: textPath,
    offset: textNode.text.length,
  });
};
