import { TextDescription } from '@styled-icons/fluentui-system-regular';
import { setNodes, useEditorRef } from '@udecode/plate-common';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { useIsElementActive } from '@app/plate/hooks/use-is-element-active';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';

export const ParagraphButton = () => {
  const editor = useEditorRef();
  const paragraphActive = useIsElementActive(ELEMENT_PARAGRAPH);
  const unchangeable = useIsUnchangeable();

  return (
    <ToolbarIconButton
      label="Normal tekst"
      onClick={() => setNodes(editor, { type: ELEMENT_PARAGRAPH })}
      icon={<TextDescription aria-hidden width={24} />}
      disabled={unchangeable}
      active={paragraphActive}
    />
  );
};
