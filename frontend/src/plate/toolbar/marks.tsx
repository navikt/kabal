import { MOD_KEY_TEXT } from '@app/keys';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useMyPlateEditorState } from '@app/plate/types';
import { isOfElementTypesFn } from '@app/plate/utils/queries';
import { ClearFormatting, TextBold, TextItalic, TextUnderline } from '@styled-icons/fluentui-system-regular';
import { BaseBoldPlugin, BaseItalicPlugin, BaseUnderlinePlugin } from '@udecode/plate-basic-marks';
import { getPluginType } from '@udecode/plate-core';

import { HEADING_KEYS } from '@udecode/plate-heading';
import { useMarkToolbarButton, useMarkToolbarButtonState } from '@udecode/plate/react';

export const Marks = () => {
  const editor = useMyPlateEditorState();

  const isInPlaceholder = editor.api.some({ match: { type: ELEMENT_PLACEHOLDER } });
  const isInHeading = editor.api.some({
    match: isOfElementTypesFn([HEADING_KEYS.h1, HEADING_KEYS.h2, HEADING_KEYS.h3]),
  });

  const isInUnchangeableElement = useIsUnchangeable();

  const disabled = isInHeading || (isInUnchangeableElement && !isInPlaceholder);

  const boldState = useMarkToolbarButtonState({ nodeType: getPluginType(editor, BaseBoldPlugin) });
  const {
    props: { onClick: toggleBold, pressed: boldPressed },
  } = useMarkToolbarButton(boldState);

  const italicState = useMarkToolbarButtonState({ nodeType: getPluginType(editor, BaseItalicPlugin) });
  const {
    props: { onClick: toggleItalic, pressed: italicPressed },
  } = useMarkToolbarButton(italicState);

  const underlineState = useMarkToolbarButtonState({ nodeType: getPluginType(editor, BaseUnderlinePlugin) });
  const {
    props: { onClick: toggleUnderline, pressed: underlinePressed },
  } = useMarkToolbarButton(underlineState);

  return (
    <>
      <ToolbarIconButton
        label="Fet skrift"
        keys={[MOD_KEY_TEXT, 'B']}
        onClick={toggleBold}
        icon={<TextBold width={24} aria-hidden />}
        active={boldPressed}
        disabled={disabled}
      />

      <ToolbarIconButton
        label="Kursiv"
        keys={[MOD_KEY_TEXT, 'I']}
        onClick={toggleItalic}
        icon={<TextItalic width={24} aria-hidden />}
        active={italicPressed}
        disabled={disabled}
      />

      <ToolbarIconButton
        label="Understreking"
        keys={[MOD_KEY_TEXT, 'U']}
        onClick={toggleUnderline}
        icon={<TextUnderline width={24} aria-hidden />}
        active={underlinePressed}
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
