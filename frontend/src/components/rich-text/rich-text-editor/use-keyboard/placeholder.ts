import { isAtEndOfPlaceholder, isAtStartOfPlaceholder, isInPlaceholder } from '../../functions/maltekst';
import { HandlerFn, Key } from './types';

export const placeholder: HandlerFn = ({ editor, event }) => {
  if (!event.metaKey && !event.ctrlKey && event.key === Key.ENTER && isInPlaceholder(editor)) {
    event.preventDefault();

    return;
  }

  if (event.key === Key.DELETE && isAtEndOfPlaceholder(editor)) {
    event.preventDefault();

    return;
  }

  if (event.key === Key.BACKSPACE && isAtStartOfPlaceholder(editor)) {
    event.preventDefault();
  }
};
