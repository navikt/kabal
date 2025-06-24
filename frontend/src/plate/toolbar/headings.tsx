import { useIsElementActive } from '@app/plate/hooks/use-is-element-active';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useIsInList } from '@app/plate/toolbar/use-is-in-list';
import { useIsInTable } from '@app/plate/toolbar/use-is-in-table';
import { useMyPlateEditorState } from '@app/plate/types';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { TextHeader1, TextHeader2, TextHeader3 } from '@styled-icons/fluentui-system-regular';

export const Headings = () => {
  const editor = useMyPlateEditorState();
  const unchangeable = useIsUnchangeable();
  const inList = useIsInList();
  const inTable = useIsInTable();
  const disabled = unchangeable || inList || inTable;

  return (
    <>
      <ToolbarIconButton
        label="Dokumenttittel / Overskrift 1"
        keys={['# + mellomrom']}
        onClick={() => editor.tf.setNodes({ type: BaseH1Plugin.key })}
        icon={<TextHeader1 width={24} aria-hidden />}
        active={useIsElementActive(BaseH1Plugin.key)}
        disabled={disabled}
      />

      <ToolbarIconButton
        label="Overskrift 2"
        keys={['## + mellomrom']}
        onClick={() => editor.tf.setNodes({ type: BaseH2Plugin.key })}
        icon={<TextHeader2 width={24} aria-hidden />}
        active={useIsElementActive(BaseH2Plugin.key)}
        disabled={disabled}
      />

      <ToolbarIconButton
        label="Overskrift 3"
        keys={['### + mellomrom']}
        onClick={() => editor.tf.setNodes({ type: BaseH3Plugin.key })}
        icon={<TextHeader3 width={24} aria-hidden />}
        active={useIsElementActive(BaseH3Plugin.key)}
        disabled={disabled}
      />
    </>
  );
};
