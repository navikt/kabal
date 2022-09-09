import { toggleMark } from '../../functions/marks';
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
        event.preventDefault();
        selectAll(event, editor);
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
