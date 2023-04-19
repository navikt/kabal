import { Range } from 'slate';
import {
  insertPlaceholderFromSelection,
  isPlaceholderActive,
  removePlaceholder,
} from '../../functions/insert-placeholder';
import { toggleMark } from '../../functions/marks';
import { insertTable } from '../../functions/table/insert-table';
import { MarkKeys } from '../../types/marks';
import { selectAll } from './select-all';
import { HandlerFn } from './types';

export const hotkeys: HandlerFn = ({ editor, event, context }) => {
  const {
    showNewComment,
    setShowNewComment,
    showMaltekstTags,
    setShowMaltekstTags,
    showGodeFormuleringer,
    setShowGodeFormuleringer,
  } = context;

  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'b': {
        event.preventDefault();
        toggleMark(editor, MarkKeys.bold);

        return;
      }
      case 'i': {
        event.preventDefault();
        toggleMark(editor, MarkKeys.italic);

        return;
      }
      case 'u': {
        event.preventDefault();
        toggleMark(editor, MarkKeys.underline);

        return;
      }
      case 's': {
        event.preventDefault();

        return;
      }
      case 'k': {
        event.preventDefault();
        setShowNewComment(!showNewComment);

        return;
      }
      case 'd': {
        event.preventDefault();
        setShowMaltekstTags(!showMaltekstTags);

        return;
      }
      case 'a': {
        return selectAll(event, editor);
      }
      case 'm': {
        event.preventDefault();
        insertTable(editor);

        return;
      }
      case 'p': {
        event.preventDefault();

        if (isPlaceholderActive(editor)) {
          removePlaceholder(editor);

          return;
        }

        if (Range.isCollapsed(editor.selection)) {
          return;
        }

        insertPlaceholderFromSelection(editor);

        return;
      }
    }

    if (event.shiftKey) {
      switch (event.key) {
        case 'F':
        case 'f':
          event.preventDefault();
          setShowGodeFormuleringer(!showGodeFormuleringer);
          break;
        default:
      }
    }
  }
};
