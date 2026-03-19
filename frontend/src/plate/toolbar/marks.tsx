import {
  BaseBoldPlugin,
  BaseH1Plugin,
  BaseH2Plugin,
  BaseH3Plugin,
  BaseItalicPlugin,
  BaseUnderlinePlugin,
} from '@platejs/basic-nodes';
import { ClearFormatting, TextBold, TextItalic, TextUnderline } from '@styled-icons/fluentui-system-regular';
import { MOD_KEY_TEXT } from '@/keys';
import { useIsUnchangeable } from '@/plate/hooks/use-is-unchangeable';
import { ELEMENT_PLACEHOLDER } from '@/plate/plugins/element-types';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';
import { useMyPlateEditorState } from '@/plate/types';
import { isOfElementTypesFn } from '@/plate/utils/queries';

export const Marks = () => {
  const editor = useMyPlateEditorState();

  const isInPlaceholder = editor.api.some({ match: { type: ELEMENT_PLACEHOLDER } });
  const isInHeading = editor.api.some({
    match: isOfElementTypesFn([BaseH1Plugin.key, BaseH2Plugin.key, BaseH3Plugin.key]),
  });

  const isInUnchangeableElement = useIsUnchangeable();

  const disabled = isInHeading || (isInUnchangeableElement && !isInPlaceholder);

  return (
    <>
      <ToolbarIconButton
        label="Fet skrift"
        keys={[MOD_KEY_TEXT, 'B']}
        onClick={() => editor.tf.toggleMark(BaseBoldPlugin.key)}
        icon={<TextBold width={24} aria-hidden />}
        active={editor.api.hasMark(BaseBoldPlugin.key)}
        disabled={disabled}
      />

      <ToolbarIconButton
        label="Kursiv"
        keys={[MOD_KEY_TEXT, 'I']}
        onClick={() => editor.tf.toggleMark(BaseItalicPlugin.key)}
        icon={<TextItalic width={24} aria-hidden />}
        active={editor.api.hasMark(BaseItalicPlugin.key)}
        disabled={disabled}
      />

      <ToolbarIconButton
        label="Understreking"
        keys={[MOD_KEY_TEXT, 'U']}
        onClick={() => editor.tf.toggleMark(BaseUnderlinePlugin.key)}
        icon={<TextUnderline width={24} aria-hidden />}
        active={editor.api.hasMark(BaseUnderlinePlugin.key)}
        disabled={disabled}
      />

      <ToolbarIconButton
        label="Fjern formatering"
        icon={<ClearFormatting aria-hidden width={24} />}
        onClick={() => {
          editor.tf.removeMark(BaseBoldPlugin.key);
          editor.tf.removeMark(BaseItalicPlugin.key);
          editor.tf.removeMark(BaseUnderlinePlugin.key);
        }}
        disabled={disabled}
      />
    </>
  );
};
