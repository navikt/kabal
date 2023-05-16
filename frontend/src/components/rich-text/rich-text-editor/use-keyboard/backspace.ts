import { handleRegelverk } from '@app/components/rich-text/rich-text-editor/use-keyboard/backspace/regelverk';
import { isPlaceholderSelectedInMaltekstWithOverlap } from '../../functions/insert-placeholder';
import { handleLists } from './backspace/lists';
import { handleParagraph } from './backspace/paragraph';
import { handleTableCell } from './backspace/table-cell';
import { HandlerFn } from './types';

const HANDLERS: HandlerFn[] = [handleTableCell, handleParagraph, handleLists, handleRegelverk];

export const backspace: HandlerFn = (args) => {
  const { editor, event } = args;

  if (isPlaceholderSelectedInMaltekstWithOverlap(editor)) {
    event.preventDefault();

    return;
  }

  HANDLERS.forEach((handler) => {
    if (!event.defaultPrevented) {
      handler(args);
    }
  });
};