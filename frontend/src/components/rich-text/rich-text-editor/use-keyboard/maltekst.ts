import { Editor, Path, Range, Transforms } from 'slate';
import { createSimpleParagraph } from '../../../smart-editor/templates/helpers';
import { isInMaltekst, isInMaltekstAndNotPlaceholder } from '../../functions/maltekst';
import { UndeletableContentEnum } from '../../types/editor-enums';
import { isOfElementTypeFn } from '../../types/editor-type-guards';
import { MaltekstElementType } from '../../types/editor-types';
import { HandlerFn, Key } from './types';

export const maltekst: HandlerFn = ({ event, editor }) => {
  if (event.key === Key.ENTER && (event.metaKey || event.ctrlKey) && isInMaltekst(editor)) {
    event.preventDefault();

    if (editor.selection === null || Range.isExpanded(editor.selection)) {
      return;
    }

    const [nodeEntry] = Editor.nodes(editor, {
      match: isOfElementTypeFn<MaltekstElementType>(UndeletableContentEnum.MALTEKST),
    });

    if (nodeEntry === undefined) {
      return;
    }

    const [, path] = nodeEntry;
    const at = Path.next(path);
    Transforms.insertNodes(editor, createSimpleParagraph(), { at });
    Transforms.select(editor, at);

    return;
  }

  if (!event.metaKey && !event.ctrlKey && !event.key.startsWith('Arrow') && isInMaltekstAndNotPlaceholder(editor)) {
    event.preventDefault();
  }
};
