import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useIsInList } from '@app/plate/toolbar/use-is-in-list';
import { TextAlignPlugin } from '@platejs/basic-styles/react';
import { TextAlignCenter, TextAlignLeft, TextAlignRight } from '@styled-icons/fluentui-system-regular';
import { type EditorPropOptions, ElementApi } from 'platejs';
import { ParagraphPlugin, useEditorPlugin, useEditorSelector } from 'platejs/react';
import { useIsInHeading } from './use-is-in-heading';

export const Align = () => {
  const { tf } = useEditorPlugin(TextAlignPlugin);
  const value = useSelectionFragmentProp({ getProp: (node) => node.align });
  const unchangeable = useIsUnchangeable();
  const isInList = useIsInList();
  const isInHeading = useIsInHeading();

  const disabled = unchangeable || isInList || isInHeading;

  return (
    <>
      <ToolbarIconButton
        label="Venstrejuster"
        onClick={() => tf.textAlign.setNodes('left')}
        icon={<TextAlignLeft aria-hidden width={24} />}
        active={value === 'left'}
        disabled={disabled}
      />
      <ToolbarIconButton
        label="Midtstill"
        onClick={() => tf.textAlign.setNodes('center')}
        icon={<TextAlignCenter aria-hidden width={24} />}
        active={value === 'center'}
        disabled={disabled}
      />
      <ToolbarIconButton
        label="Høyrejuster"
        onClick={() => tf.textAlign.setNodes('right')}
        icon={<TextAlignRight aria-hidden width={24} />}
        active={value === 'right'}
        disabled={disabled}
      />
    </>
  );
};

// Fixed version of {  useSelectionFragmentProp } from 'platejs/react';
const useSelectionFragmentProp = (options: Omit<EditorPropOptions, 'nodes'> = {}) => {
  return useEditorSelector((editor) => {
    const node = editor.api.node({ match: { type: ParagraphPlugin.key } });

    if (!node || !ElementApi.isElement(node[0])) {
      return undefined;
    }

    return editor.api.prop({ nodes: [node[0]], ...options });
  }, []);
};
