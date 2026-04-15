import { ArrowUndoIcon, BucketMopIcon } from '@navikt/aksel-icons';
import { DocumentPageBreak, TextDescription } from '@styled-icons/fluentui-system-regular';
import { BaseParagraphPlugin } from 'platejs';
import { useEditorReadOnly, useSelectionExpanded } from 'platejs/react';
import { MOD_KEY_TEXT } from '@/keys';
import { useIsElementActive } from '@/plate/hooks/use-is-element-active';
import { useIsUnchangeable } from '@/plate/hooks/use-is-unchangeable';
import { cleanupDocument } from '@/plate/plugins/cleanup/cleanup-document';
import { Align } from '@/plate/toolbar/align';
import { CycleCaseButton } from '@/plate/toolbar/cycle-case-button';
import { Headings } from '@/plate/toolbar/headings';
import { Indent } from '@/plate/toolbar/indent';
import { Lists } from '@/plate/toolbar/lists';
import { Marks } from '@/plate/toolbar/marks';
import { ToolbarSeparator } from '@/plate/toolbar/separator';
import { InsertTableButton } from '@/plate/toolbar/table/insert-table-button';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';
import { useIsInList } from '@/plate/toolbar/use-is-in-list';
import { useIsInTable } from '@/plate/toolbar/use-is-in-table';
import { useMyPlateEditorRef } from '@/plate/types';
import { insertPageBreak } from '@/plate/utils/transforms';

export const DefaultToolbarButtons = () => {
  const editor = useMyPlateEditorRef();
  const isReadOnly = useEditorReadOnly();
  const unchangeable = useIsUnchangeable();
  const inList = useIsInList();
  const inTable = useIsInTable();
  const isExpanded = useSelectionExpanded();

  return (
    <>
      <ToolbarIconButton
        label="Angre"
        keys={[MOD_KEY_TEXT, 'Z']}
        icon={<ArrowUndoIcon aria-hidden />}
        onClick={editor.undo}
      />

      <ToolbarIconButton
        label="Gjenopprett"
        keys={[MOD_KEY_TEXT, 'Shift', 'Z']}
        icon={<ArrowUndoIcon aria-hidden className="-scale-x-100" />}
        onClick={editor.redo}
      />

      <ToolbarSeparator />

      <Marks />

      <CycleCaseButton />

      <ToolbarSeparator />

      <Indent />

      <ToolbarIconButton
        label="Sett inn sideskift"
        keys={[MOD_KEY_TEXT, 'Enter']}
        onClick={() => insertPageBreak(editor)}
        icon={<DocumentPageBreak aria-hidden width={24} />}
        disabled={unchangeable || inList || inTable}
      />

      <ToolbarSeparator />

      <ToolbarIconButton
        label="Normal tekst"
        onClick={() => editor.tf.setNodes({ type: BaseParagraphPlugin.node.type })}
        icon={<TextDescription aria-hidden width={24} />}
        disabled={unchangeable}
        active={useIsElementActive(BaseParagraphPlugin.node.type)}
      />

      <Headings />

      <ToolbarSeparator />

      <Lists />

      <InsertTableButton />

      <Align />

      <ToolbarSeparator />

      <ToolbarIconButton
        label={isExpanded ? `Rydd markert innhold - ${description}` : `Rydd hele dokumentet - ${description}`}
        keys={[MOD_KEY_TEXT, 'K']}
        icon={<BucketMopIcon aria-hidden />}
        onClick={() => cleanupDocument(editor)}
        disabled={isReadOnly}
      />
    </>
  );
};

const description = 'sletter tomme avsnitt, overskrifter og listepunkter. Fjerner doble mellomrom.';
