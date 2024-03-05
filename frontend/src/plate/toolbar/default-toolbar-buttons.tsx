import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { DocumentPageBreak, TextDescription } from '@styled-icons/fluentui-system-regular';
import { setNodes } from '@udecode/plate-common';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import React from 'react';
import { styled } from 'styled-components';
import { MOD_KEY } from '@app/keys';
import { useIsElementActive } from '@app/plate/hooks/use-is-element-active';
import { useIsUnchangeable } from '@app/plate/hooks/use-is-unchangeable';
import { Align } from '@app/plate/toolbar/align';
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

export const DefaultToolbarButtons = () => {
  const editor = useMyPlateEditorRef();
  const unchangeable = useIsUnchangeable();
  const inList = useIsInList();
  const inTable = useIsInTable();

  return (
    <>
      <ToolbarIconButton
        label="Angre"
        keys={[MOD_KEY, 'Z']}
        icon={<ArrowUndoIcon aria-hidden />}
        onClick={editor.undo}
      />

      <ToolbarIconButton
        label="Gjenopprett"
        keys={[MOD_KEY, 'Shift', 'Z']}
        icon={<Redo aria-hidden />}
        onClick={editor.redo}
      />

      <ToolbarSeparator />

      <Marks />

      <ToolbarSeparator />

      <Indent />

      <ToolbarIconButton
        label="Sett inn sideskift"
        keys={[MOD_KEY, 'Enter']}
        onClick={() => insertPageBreak(editor)}
        icon={<DocumentPageBreak aria-hidden width={24} />}
        disabled={unchangeable || inList || inTable}
      />

      <ToolbarSeparator />

      <ToolbarIconButton
        label="Normal tekst"
        onClick={() => setNodes(editor, { type: ELEMENT_PARAGRAPH })}
        icon={<TextDescription aria-hidden width={24} />}
        disabled={unchangeable}
        active={useIsElementActive(ELEMENT_PARAGRAPH)}
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
