import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { TextBulletListLtr, TextNumberListLtr } from '@styled-icons/fluentui-system-regular';
import { getPluginType } from '@udecode/plate-core';
import { useEditorRef } from '@udecode/plate-core/react';
import { BaseBulletedListPlugin, BaseNumberedListPlugin } from '@udecode/plate-list';
import { useListToolbarButton, useListToolbarButtonState } from '@udecode/plate-list/react';

export const Lists = () => {
  const editor = useEditorRef();
  const ulState = useListToolbarButtonState({ nodeType: getPluginType(editor, BaseBulletedListPlugin) });
  const olState = useListToolbarButtonState({ nodeType: getPluginType(editor, BaseNumberedListPlugin) });
  const {
    props: { onClick: toggleUl, pressed: ulActive },
  } = useListToolbarButton(ulState);
  const {
    props: { onClick: toggleOl, pressed: olActive },
  } = useListToolbarButton(olState);

  const disabled = useIsUnchangeable();

  return (
    <>
      <ToolbarIconButton
        label="Punktliste"
        keys={['- + mellomrom', '* + mellomrom']}
        onClick={toggleUl}
        icon={<TextBulletListLtr width={24} aria-hidden />}
        active={ulActive}
        disabled={disabled}
      />

      <ToolbarIconButton
        label="Nummerert liste"
        keys={['1. + mellomrom', '1) + mellomrom']}
        onClick={toggleOl}
        icon={<TextNumberListLtr width={24} aria-hidden />}
        active={olActive}
        disabled={disabled}
      />
    </>
  );
};
