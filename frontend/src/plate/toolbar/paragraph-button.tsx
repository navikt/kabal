import { useIsElementActive } from '@app/plate/hooks/use-is-element-active';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { TextDescription } from '@styled-icons/fluentui-system-regular';
import { BaseParagraphPlugin } from '@udecode/plate';
import { useEditorRef } from '@udecode/plate-core/react';

export const ParagraphButton = () => {
  const editor = useEditorRef();
  const paragraphActive = useIsElementActive(BaseParagraphPlugin.node.type);
  const unchangeable = useIsUnchangeable();

  return (
    <ToolbarIconButton
      label="Normal tekst"
      onClick={() => editor.tf.setNodes({ type: BaseParagraphPlugin.node.type })}
      icon={<TextDescription aria-hidden width={24} />}
      disabled={unchangeable}
      active={paragraphActive}
    />
  );
};
