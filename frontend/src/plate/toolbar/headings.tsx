import { useIsElementActive } from '@app/plate/hooks/use-is-element-active';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useIsInList } from '@app/plate/toolbar/use-is-in-list';
import { useIsInTable } from '@app/plate/toolbar/use-is-in-table';
import { useMyPlateEditorState } from '@app/plate/types';
import { TextHeader1, TextHeader2, TextHeader3 } from '@styled-icons/fluentui-system-regular';
import { HEADING_KEYS } from '@udecode/plate-heading';

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
        onClick={() => editor.tf.setNodes({ type: HEADING_KEYS.h1 })}
        icon={<TextHeader1 width={24} aria-hidden />}
        active={useIsElementActive(HEADING_KEYS.h1)}
        disabled={disabled}
      />

      <ToolbarIconButton
        label="Overskrift 2"
        keys={['## + mellomrom']}
        onClick={() => editor.tf.setNodes({ type: HEADING_KEYS.h2 })}
        icon={<TextHeader2 width={24} aria-hidden />}
        active={useIsElementActive(HEADING_KEYS.h2)}
        disabled={disabled}
      />

      <ToolbarIconButton
        label="Overskrift 3"
        keys={['### + mellomrom']}
        onClick={() => editor.tf.setNodes({ type: HEADING_KEYS.h3 })}
        icon={<TextHeader3 width={24} aria-hidden />}
        active={useIsElementActive(HEADING_KEYS.h3)}
        disabled={disabled}
      />
    </>
  );
};
