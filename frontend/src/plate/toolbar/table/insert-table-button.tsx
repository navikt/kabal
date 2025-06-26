import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { createTable } from '@app/plate/templates/helpers';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useIsInTable } from '@app/plate/toolbar/use-is-in-table';
import {
  type BulletListElement,
  type H1Element,
  type H2Element,
  type H3Element,
  type NumberedListElement,
  type ParagraphElement,
  useMyPlateEditorRef,
} from '@app/plate/types';
import { isNodeEmpty, isOfElementTypesFn, nextPath } from '@app/plate/utils/queries';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BaseBulletedListPlugin, BaseNumberedListPlugin } from '@platejs/list-classic';
import { TableAdd } from '@styled-icons/fluentui-system-regular';
import { BaseParagraphPlugin } from 'platejs';

export const InsertTableButton = () => {
  const editor = useMyPlateEditorRef();
  const unchangeable = useIsUnchangeable();
  const inTable = useIsInTable();
  const disabled = unchangeable || inTable;

  // Normal insertTable() leaves an empty paragraph above
  const onClick = () => {
    const current = editor.api.node<
      ParagraphElement | H1Element | H2Element | H3Element | BulletListElement | NumberedListElement
    >({
      match: isOfElementTypesFn([
        BaseParagraphPlugin.node.type,
        BaseH1Plugin.key,
        BaseH2Plugin.key,
        BaseH3Plugin.key,
        BaseBulletedListPlugin.node.type,
        BaseNumberedListPlugin.node.type,
      ]),
    });

    editor.tf.insertNodes(createTable(), { at: current !== undefined ? nextPath(current[1]) : undefined });

    if (current !== undefined && isNodeEmpty(current[0])) {
      editor.tf.removeNodes({ at: current[1] });
    }
  };

  return (
    <ToolbarIconButton
      label="Sett inn tabell"
      onClick={onClick}
      icon={<TableAdd width={24} aria-hidden />}
      disabled={disabled}
      active={inTable}
    />
  );
};
