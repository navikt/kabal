import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { type RichTextEditor, useMyPlateEditorState } from '@app/plate/types';
import { isInList, isInTable } from '@app/plate/utils/queries';
import { TextIndentDecreaseLtr, TextIndentIncreaseLtr } from '@styled-icons/fluentui-system-regular';
import { indent, outdent } from '@udecode/plate-indent';
import { BaseBulletedListPlugin, BaseNumberedListPlugin } from '@udecode/plate-list';
import { BaseTablePlugin } from '@udecode/plate-table';

const isIndented = (editor: RichTextEditor) =>
  editor.api.some({
    match: (n) => editor.api.isBlock(n) && 'indent' in n && typeof n.indent === 'number' && n.indent !== 0,
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
                ? {
                    match: {
                      type: [
                        BaseBulletedListPlugin.node.type,
                        BaseNumberedListPlugin.node.type,
                        BaseTablePlugin.node.type,
                      ],
                    },
                    mode: 'highest',
                  }
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
                ? {
                    match: {
                      type: [
                        BaseBulletedListPlugin.node.type,
                        BaseNumberedListPlugin.node.type,
                        BaseTablePlugin.node.type,
                      ],
                    },
                    mode: 'highest',
                  }
                : undefined,
          });
        }}
        icon={<TextIndentDecreaseLtr width={24} aria-hidden />}
        disabled={disabled}
      />
    </>
  );
};
