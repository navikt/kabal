import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { type RichTextEditor, useMyPlateEditorState } from '@app/plate/types';
import { isInList, isInTable } from '@app/plate/utils/queries';
import { TextIndentDecreaseLtr, TextIndentIncreaseLtr } from '@styled-icons/fluentui-system-regular';
import { type TElement, isBlock, someNode } from '@udecode/plate-common';
import { indent, outdent } from '@udecode/plate-indent';
import { ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_TABLE } from '@udecode/plate-table';

const isIndented = (editor: RichTextEditor) =>
  someNode<TElement>(editor, {
    match: (n) => isBlock(editor, n) && 'indent' in n && typeof n['indent'] === 'number' && n.indent !== 0,
    universal: true,
  });

export const Indent = () => {
  const editor = useMyPlateEditorState();
  const active = isIndented(editor);
  const disabled = useIsUnchangeable();

  return (
    <>
      <ToolbarIconButton
        label="Innrykk"
        keys={['Tab']}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          indent(editor, {
            getNodesOptions:
              isInList(editor) || isInTable(editor)
                ? { match: { type: [ELEMENT_UL, ELEMENT_OL, ELEMENT_TABLE] }, mode: 'highest' }
                : undefined,
          });
        }}
        icon={<TextIndentIncreaseLtr width={24} aria-hidden />}
        active={active}
        disabled={disabled}
      />
      <ToolbarIconButton
        label="Fjern innrykk"
        keys={['Shift', 'Tab']}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          outdent(editor, {
            getNodesOptions:
              isInList(editor) || isInTable(editor)
                ? { match: { type: [ELEMENT_UL, ELEMENT_OL, ELEMENT_TABLE] }, mode: 'highest' }
                : undefined,
          });
        }}
        icon={<TextIndentDecreaseLtr width={24} aria-hidden />}
        disabled={disabled}
      />
    </>
  );
};
