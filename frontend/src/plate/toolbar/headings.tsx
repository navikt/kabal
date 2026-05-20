import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin, BaseH4Plugin } from '@platejs/basic-nodes';
import { useIsElementActive } from '@/plate/hooks/use-is-element-active';
import { useIsUnchangeable } from '@/plate/hooks/use-is-unchangeable';
import { ToolbarDropdown } from '@/plate/toolbar/toolbar-dropdown';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';
import { useIsInList } from '@/plate/toolbar/use-is-in-list';
import { useIsInTable } from '@/plate/toolbar/use-is-in-table';
import { useMyPlateEditorState } from '@/plate/types';

const BUTTON_CLASSNAME = '[&>*]:text-[20px] h-[32px]';

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
        active={useIsElementActive(BaseH1Plugin.key)}
        placement="right"
        className={BUTTON_CLASSNAME}
      >
        H1
      </ToolbarIconButton>

      <ToolbarIconButton
        label="Overskrift 2"
        keys={['## + mellomrom']}
        onClick={() => editor.tf.setNodes({ type: BaseH2Plugin.key })}
        active={useIsElementActive(BaseH2Plugin.key)}
        placement="right"
        className={BUTTON_CLASSNAME}
      >
        H2
      </ToolbarIconButton>

      <ToolbarIconButton
        label="Overskrift 3"
        keys={['### + mellomrom']}
        onClick={() => editor.tf.setNodes({ type: BaseH3Plugin.key })}
        active={useIsElementActive(BaseH3Plugin.key)}
        placement="right"
        className={BUTTON_CLASSNAME}
      >
        H3
      </ToolbarIconButton>

      <ToolbarIconButton
        label="Overskrift 4"
        keys={['#### + mellomrom']}
        onClick={() => editor.tf.setNodes({ type: BaseH4Plugin.key })}
        active={useIsElementActive(BaseH4Plugin.key)}
        placement="right"
        className={BUTTON_CLASSNAME}
      >
        H4
      </ToolbarIconButton>
    </ToolbarDropdown>
  );
};
