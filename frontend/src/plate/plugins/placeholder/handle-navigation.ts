import { isMetaKey, Keys } from '@app/keys';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { selectNextTextNode } from '@app/plate/plugins/placeholder/select-next-text-node';
import { selectPreviousTextNode } from '@app/plate/plugins/placeholder/select-previous-text-node';
import type { PlateEditor } from 'platejs/react';
import type { KeyboardEvent } from 'react';

export const handleNavigation = (editor: PlateEditor, event: KeyboardEvent): boolean => {
  if (editor.selection === null || isMetaKey(event) || editor.api.isExpanded()) {
    return false;
  }

  if (
    event.key !== Keys.Enter &&
    event.key !== Keys.ArrowRight &&
    event.key !== Keys.ArrowLeft &&
    event.key !== Keys.ArrowUp &&
    event.key !== Keys.ArrowDown
  ) {
    return false;
  }

  const placeholderEntry = editor.api.node({ match: { type: ELEMENT_PLACEHOLDER } });

  if (placeholderEntry === undefined) {
    return false;
  }

  const [, placeholderPath] = placeholderEntry;

  if (event.key === Keys.Enter) {
    event.preventDefault();
    event.stopPropagation();

    event.shiftKey ? selectPreviousTextNode(editor, placeholderPath) : selectNextTextNode(editor, placeholderPath);
    return true; // Prevent further handling
  }

  if (
    event.key === Keys.ArrowDown ||
    (event.key === Keys.ArrowRight && editor.api.isEnd(editor.selection.focus, placeholderPath))
  ) {
    event.preventDefault();
    event.stopPropagation();

    selectNextTextNode(editor, placeholderPath);
    return true; // Prevent further handling
  }

  if (
    event.key === Keys.ArrowUp ||
    (event.key === Keys.ArrowLeft && editor.api.isStart(editor.selection.focus, placeholderPath))
  ) {
    event.preventDefault();
    event.stopPropagation();

    selectPreviousTextNode(editor, placeholderPath);
    return true; // Prevent further handling
  }

  return false;
};
