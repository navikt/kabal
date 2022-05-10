import { Editor, Path, Text, Transforms } from 'slate';
import { DeletableVoidElementsEnum } from '../types/editor-enums';
import { isOfElementType } from '../types/editor-type-guards';
import { FlettefeltElementType } from '../types/editor-void-types';

const getFlettefeltPath = (editor: Editor): Path | null => {
  const [flettefeltEntry] = Editor.nodes<FlettefeltElementType>(editor, {
    match: (n) => isOfElementType<FlettefeltElementType>(n, DeletableVoidElementsEnum.FLETTEFELT),
    voids: true,
  });

  if (flettefeltEntry === undefined) {
    return null;
  }

  const [, flettefeltPath] = flettefeltEntry;
  return flettefeltPath;
};

export const moveRight = (editor: Editor, event?: React.KeyboardEvent) => {
  const flettefeltPath = getFlettefeltPath(editor);

  if (flettefeltPath === null) {
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
