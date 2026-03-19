import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { TextHeader1, TextHeader2, TextHeader3 } from '@styled-icons/fluentui-system-regular';
import { useIsElementActive } from '@/plate/hooks/use-is-element-active';
import { useIsUnchangeable } from '@/plate/hooks/use-is-unchangeable';
import { ToolbarDropdown } from '@/plate/toolbar/toolbar-dropdown';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';
import { useIsInList } from '@/plate/toolbar/use-is-in-list';
import { useIsInTable } from '@/plate/toolbar/use-is-in-table';
import { useMyPlateEditorState } from '@/plate/types';

export const Headings = () => {
  const editor = useMyPlateEditorState();
  const unchangeable = useIsUnchangeable();
  const inList = useIsInList();
  const inTable = useIsInTable();
  const disabled = unchangeable || inList || inTable;

  return (
    <ToolbarDropdown
      icon={
        <span aria-hidden className="text-[24px]">
          H
        </span>
      }
      title="Overskrifter"
      disabled={disabled}
    >
      <ToolbarIconButton
        label="Dokumenttittel / Overskrift 1"
        keys={['# + mellomrom']}
        onClick={() => editor.tf.setNodes({ type: BaseH1Plugin.key })}
        icon={<TextHeader1 width={24} aria-hidden />}
        active={useIsElementActive(BaseH1Plugin.key)}
        placement="right"
      />

      <ToolbarIconButton
        label="Overskrift 2"
        keys={['## + mellomrom']}
        onClick={() => editor.tf.setNodes({ type: BaseH2Plugin.key })}
        icon={<TextHeader2 width={24} aria-hidden />}
        active={useIsElementActive(BaseH2Plugin.key)}
        placement="right"
      />

      <ToolbarIconButton
        label="Overskrift 3"
        keys={['### + mellomrom']}
        onClick={() => editor.tf.setNodes({ type: BaseH3Plugin.key })}
        icon={<TextHeader3 width={24} aria-hidden />}
        active={useIsElementActive(BaseH3Plugin.key)}
        placement="right"
      />
    </ToolbarDropdown>
  );
};
