import { TableAdd } from '@styled-icons/fluentui-system-regular';
import { findNode, insertNodes, removeNodes } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { createTable } from '@app/plate/templates/helpers';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useIsInTable } from '@app/plate/toolbar/use-is-in-table';
import {
  BulletListElement,
  H1Element,
  H2Element,
  H3Element,
  NumberedListElement,
  ParagraphElement,
  useMyPlateEditorRef,
} from '@app/plate/types';
import { isNodeEmpty, isOfElementTypesFn, nextPath } from '@app/plate/utils/queries';

export const InsertTableButton = () => {
  const editor = useMyPlateEditorRef();
  const unchangeable = useIsUnchangeable();
  const inTable = useIsInTable();
  const disabled = unchangeable || inTable;

  // Normal insertTable() leaves an empty paragraph above
  const onClick = () => {
    const current = findNode<
      ParagraphElement | H1Element | H2Element | H3Element | BulletListElement | NumberedListElement
    >(editor, {
      match: isOfElementTypesFn([ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_UL, ELEMENT_OL]),
    });

    insertNodes(editor, createTable(), { at: current !== undefined ? nextPath(current[1]) : undefined });

    if (current !== undefined) {
      if (isNodeEmpty(current[0])) {
        removeNodes(editor, { at: current[1] });
      }
    }
  };

  return (
    <ToolbarIconButton
      label="Sett inn tabell"
      onClick={onClick}
      icon={<TableAdd width={24} aria-hidden />}
      disabled={disabled}
      active={inTable}
    />
  );
};
