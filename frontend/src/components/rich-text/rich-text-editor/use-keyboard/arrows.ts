import { moveLeft, moveRight } from '../../functions/flettefelt-arrows';
import { HandlerFn } from './types';

export const arrows: HandlerFn = ({ event, editor }) => {
  // Make the caret move predictably when using arrow keys. Not skipping over text before or after flettefelt.
  if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) {
    return;
  }

  if (event.key === 'ArrowRight') {
    moveRight(editor, event);
  } else if (event.key === 'ArrowLeft') {
    moveLeft(editor, event);
  }
};
