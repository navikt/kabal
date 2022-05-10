// import { Cognition } from '@navikt/ds-icons';
import { Cancel } from '@navikt/ds-icons';
import { FormatClear } from '@styled-icons/material/FormatClear';
import React from 'react';
import { useSlate } from 'slate-react';
import styled from 'styled-components';
import { clearFormatting } from '../functions/clear-formatting';
// import { insertFlettefelt } from '../functions/insert-flettefelt';
import { insertPageBreak, insertPageBreakIsAvailable } from '../functions/insert-page-break';
import { isMarkingAvailable } from '../functions/marks';
import { isTextAlignAvailable } from '../functions/text-align';
import { Content } from './content';
import { Headings } from './headings';
import { PageBreakIcon } from './icons/page-break';
import { Lists } from './lists';
import { Marks } from './marks';
import { ToolbarSeparator } from './separator';
import { SmartEditorButtons, SmartEditorButtonsProps } from './smart-editor-buttons';
import { TextAligns } from './text-aligns';
import { ToolbarIconButton } from './toolbarbutton';

const ICON_SIZE = 24;

interface Props extends SmartEditorButtonsProps {
  visible: boolean;
}

export const Toolbar = ({ visible, showCommentsButton, showAnnotationsButton, showGodeFormuleringerButton }: Props) => {
  const editor = useSlate();

  const marksAvailable = isMarkingAvailable(editor);
  const textAlignAvailable = isTextAlignAvailable(editor);

  return (
    <ToolbarStyle visible={visible} aria-hidden={!visible}>
      <Marks iconSize={ICON_SIZE} disabled={!marksAvailable} />
      <Content iconSize={ICON_SIZE} />
      <ToolbarIconButton
        label="Fjern formatering"
        icon={<FormatClear width={ICON_SIZE} />}
        active={false}
        onClick={() => clearFormatting(editor)}
      />
      <ToolbarIconButton
        label="Sett inn sideskift (Ctrl/⌘ + Enter)"
        onClick={() => insertPageBreak(editor)}
        icon={<PageBreakIcon height={ICON_SIZE} />}
        active={false}
        disabled={!insertPageBreakIsAvailable(editor)}
      />

      <ToolbarSeparator />

      <Headings iconSize={ICON_SIZE} />

      <ToolbarSeparator />

      <Lists iconSize={ICON_SIZE} />
      <TextAligns iconSize={ICON_SIZE} disabled={!textAlignAvailable} />

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
      />

      <ToolbarIconButton
        label="Angre (Ctrl/⌘ + Z)"
        icon={<Cancel width={ICON_SIZE} />}
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
  z-index: 1;
  padding: 2px;
  margin-left: 16px;
  margin-right: 16px;
  overflow: hidden;
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2);
  will-change: opacity, visibility;
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

const Redo = styled(Cancel)`
  transform: scaleX(-1);
`;
