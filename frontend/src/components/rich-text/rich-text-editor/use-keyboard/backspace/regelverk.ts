import { Path } from 'slate';
import { RegelverkContainerType } from '@app/components/rich-text/types/editor-types';
import { getCurrentElement } from '../../../functions/blocks';
import { UndeletableContentEnum } from '../../../types/editor-enums';
import { HandlerFn } from '../types';

export const handleRegelverk: HandlerFn = ({ editor, event }) => {
  const regelverkContainerEntry = getCurrentElement<RegelverkContainerType>(
    editor,
    UndeletableContentEnum.REGELVERK_CONTAINER,
  );

  if (typeof regelverkContainerEntry === 'undefined') {
    return;
  }

  const [node, path] = regelverkContainerEntry;

  const isValid = Path.isCommon(path, editor.selection.focus.path) && Path.isCommon(path, editor.selection.anchor.path);

  if (isValid && (editor.selection.focus.offset !== 0 || node.children.length > 1)) {
    return;
  }

  event.preventDefault();
};
