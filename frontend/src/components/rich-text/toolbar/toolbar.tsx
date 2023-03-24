import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { ClearFormatting } from '@styled-icons/fluentui-system-regular/ClearFormatting';
import { DocumentPageBreak } from '@styled-icons/fluentui-system-regular/DocumentPageBreak';
import React from 'react';
import { useSlate } from 'slate-react';
import styled from 'styled-components';
import { clearFormatting } from '../functions/clear-formatting';
import { insertPageBreak, insertPageBreakIsAvailable } from '../functions/insert-page-break';
import { isInPlaceholderInMaltekst } from '../functions/maltekst';
// import { insertFlettefelt } from '../functions/insert-flettefelt';
import { isMarkingAvailable } from '../functions/marks';
import { isTextAlignAvailable } from '../functions/text-align';
import { Content } from './content';
import { Headings } from './headings';
import { Lists } from './lists';
import { Marks } from './marks';
import { ToolbarSeparator } from './separator';
import { SmartEditorButtons, SmartEditorButtonsProps } from './smart-editor-buttons';
import { TableButton } from './table';
import { TextAligns } from './text-aligns';
import { ToolbarIconButton } from './toolbarbutton';

const ICON_SIZE = 24;

interface Props extends SmartEditorButtonsProps {
  visible: boolean;
}

export const Toolbar = ({
  visible,
  showCommentsButton,
  showAnnotationsButton,
  showGodeFormuleringerButton,
  showPlaceholderButton,
}: Props) => {
  const editor = useSlate();

  const marksAvailable = isMarkingAvailable(editor);
  const textAlignAvailable = isTextAlignAvailable(editor);
  const notEditable = isInPlaceholderInMaltekst(editor);

  return (
    <ToolbarStyle visible={visible} aria-hidden={!visible}>
      <Marks iconSize={ICON_SIZE} disabled={!marksAvailable} />
      <Content iconSize={ICON_SIZE} />
      <ToolbarIconButton
        label="Fjern formatering"
        icon={<ClearFormatting width={ICON_SIZE} />}
        active={false}
        onClick={() => clearFormatting(editor)}
      />
      <ToolbarIconButton
        label="Sett inn sideskift (Ctrl/⌘ + Enter)"
        onClick={() => insertPageBreak(editor)}
        icon={<DocumentPageBreak height={ICON_SIZE} />}
        active={false}
        disabled={!insertPageBreakIsAvailable(editor)}
      />

      <ToolbarSeparator />

      <Headings iconSize={ICON_SIZE} />

      <ToolbarSeparator />

      <Lists iconSize={ICON_SIZE} />

      <TableButton />

      <TextAligns iconSize={ICON_SIZE} disabled={!textAlignAvailable || notEditable} />

      <ToolbarSeparator />

      {/* <ToolbarIconButton
        label="Sett inn flettefelt"
        onClick={() => insertFlettefelt(editor)}
        icon={<Cognition width={ICON_SIZE} />}
        active={false}
      /> */}

      <SmartEditorButtons
        showCommentsButton={showCommentsButton}
        showAnnotationsButton={showAnnotationsButton}
        showGodeFormuleringerButton={showGodeFormuleringerButton}
        showPlaceholderButton={showPlaceholderButton}
      />

      <ToolbarSeparator />

      <ToolbarIconButton
        label="Angre (Ctrl/⌘ + Z)"
        icon={<ArrowUndoIcon width={ICON_SIZE} />}
        active={false}
        onClick={editor.undo}
      />

      <ToolbarIconButton
        label="Gjenopprett (Ctrl/⌘ + Shift + Z)"
        icon={<Redo width={ICON_SIZE} />}
        active={false}
        onClick={editor.redo}
      />
    </ToolbarStyle>
  );
};

const ToolbarStyle = styled.section<{ visible: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 0;
  position: sticky;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 2;
  padding: 2px;
  margin-left: 16px;
  margin-right: 16px;
  /* overflow: hidden; */
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2);
  will-change: opacity, visibility;
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

const Redo = styled(ArrowUndoIcon)`
  transform: scaleX(-1);
`;
