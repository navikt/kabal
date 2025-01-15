import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { AddColumnLeftIcon } from '@app/plate/toolbar/table/icons/add-column-left';
import { AddColumnRightIcon } from '@app/plate/toolbar/table/icons/add-column-right';
import { AddRowAboveIcon } from '@app/plate/toolbar/table/icons/add-row-above';
import { AddRowBelowIcon } from '@app/plate/toolbar/table/icons/add-row-below';
import { DeleteColumnIcon } from '@app/plate/toolbar/table/icons/delete-column';
import { DeleteRowIcon } from '@app/plate/toolbar/table/icons/delete-row';
import { MergeCellsIcon } from '@app/plate/toolbar/table/icons/merge-cells';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useMyPlateEditorRef } from '@app/plate/types';
import { isOfElementTypeFn, nextPath } from '@app/plate/utils/queries';
import { TrashIcon } from '@navikt/aksel-icons';
import { TextAddSpaceAfter, TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular';
import { ElementApi } from '@udecode/plate';
import { BaseTablePlugin, deleteTable } from '@udecode/plate-table';
import { TablePlugin } from '@udecode/plate-table/react';
import { useEditorPlugin } from '@udecode/plate/react';

export const TableButtons = () => {
  const { tf } = useEditorPlugin(TablePlugin);

  const editor = useMyPlateEditorRef();
  const unchangeable = useIsUnchangeable();

  if (unchangeable) {
    return null;
  }

  const activeNode = editor.api.node({ match: (n) => ElementApi.isElement(n) && n.type === BaseTablePlugin.node.type });

  if (activeNode === undefined) {
    return null;
  }

  return (
    <>
      <ToolbarIconButton
        label="Legg til rad over"
        onClick={() => tf.insert.tableRow({ before: true })}
        icon={<AddRowAboveIcon aria-hidden />}
      />
      <ToolbarIconButton
        label="Legg til rad under"
        onClick={() => tf.insert.tableRow({ before: false })}
        icon={<AddRowBelowIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Legg til kolonne til venstre"
        onClick={() => {
          tf.insert.tableColumn({ before: true });
        }}
        icon={<AddColumnLeftIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Legg til kolonne til høyre"
        onClick={() => tf.insert.tableColumn({ before: false })}
        icon={<AddColumnRightIcon aria-hidden />}
      />

      <ToolbarIconButton label="Fjern rad" onClick={tf.remove.tableRow} icon={<DeleteRowIcon aria-hidden />} />

      <ToolbarIconButton
        label="Fjern kolonne"
        onClick={tf.remove.tableColumn}
        icon={<DeleteColumnIcon aria-hidden />}
      />

      <ToolbarIconButton
        label="Slå sammen med celle til høyre"
        onClick={tf.table.merge}
        icon={<MergeCellsIcon aria-hidden />}
      />

      <ToolbarSeparator />

      <ToolbarIconButton
        label="Legg til nytt avsnitt over"
        onClick={() => {
          const entry = editor.api.node({ match: isOfElementTypeFn(BaseTablePlugin.node.type) });

          if (entry === undefined) {
            return;
          }

          editor.tf.insertNodes(createSimpleParagraph(), { at: entry[1] });
        }}
        icon={<TextAddSpaceBefore width={24} aria-hidden />}
      />

      <ToolbarIconButton
        label="Legg til nytt avsnitt under"
        onClick={() => {
          const entry = editor.api.node({ match: isOfElementTypeFn(BaseTablePlugin.node.type) });

          if (entry === undefined) {
            return;
          }

          editor.tf.insertNodes(createSimpleParagraph(), { at: nextPath(entry[1]) });
        }}
        icon={<TextAddSpaceAfter width={24} aria-hidden />}
      />

      <ToolbarSeparator />

      <ToolbarIconButton
        label="Slett tabell"
        onClick={() => {
          const entry = editor.api.node({ match: isOfElementTypeFn(BaseTablePlugin.node.type) });

          if (entry === undefined) {
            return;
          }

          editor.tf.withoutNormalizing(() => {
            const [, path] = entry;
            editor.tf.withoutSaving(() => {
              editor.tf.insertNodes(createSimpleParagraph(), { at: path });
            });
            deleteTable(editor);
            editor.tf.select(path);
          });
        }}
        icon={<TrashIcon aria-hidden />}
      />
    </>
  );
};
