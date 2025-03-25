import { MOD_KEY_TEXT } from '@app/keys';
import { useIsElementActive } from '@app/plate/hooks/use-is-element-active';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { Align } from '@app/plate/toolbar/align';
import { fixDocument } from '@app/plate/toolbar/fix-document';
import { Headings } from '@app/plate/toolbar/headings';
import { Indent } from '@app/plate/toolbar/indent';
import { Lists } from '@app/plate/toolbar/lists';
import { Marks } from '@app/plate/toolbar/marks';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { InsertTableButton } from '@app/plate/toolbar/table/insert-table-button';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { useIsInList } from '@app/plate/toolbar/use-is-in-list';
import { useIsInTable } from '@app/plate/toolbar/use-is-in-table';
import { useMyPlateEditorRef } from '@app/plate/types';
import { insertPageBreak } from '@app/plate/utils/transforms';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import type { skipToken } from '@reduxjs/toolkit/query';
import { DocumentPageBreak, TextDescription, Wand } from '@styled-icons/fluentui-system-regular';
import { BaseParagraphPlugin } from '@udecode/plate';
import { styled } from 'styled-components';

interface Props {
  oppgaveId?: string | typeof skipToken;
}

export const DefaultToolbarButtons = ({ oppgaveId }: Props) => {
  const editor = useMyPlateEditorRef();
  const unchangeable = useIsUnchangeable();
  const inList = useIsInList();
  const inTable = useIsInTable();

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
        icon={<Redo aria-hidden />}
        onClick={editor.redo}
      />

      <ToolbarIconButton
        label="Reparer dokument"
        icon={<Wand width={24} aria-hidden />}
        onClick={() => fixDocument(editor, oppgaveId)}
      />

      <ToolbarSeparator />

      <Marks />

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
    </>
  );
};

const Redo = styled(ArrowUndoIcon)`
  transform: scaleX(-1);
`;
