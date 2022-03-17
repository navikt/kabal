import { FormatClear } from '@styled-icons/material/FormatClear';
import React from 'react';
import { useSlate } from 'slate-react';
import styled from 'styled-components';
import { Content } from './content';
import { clearFormatting } from './functions/clearFormatting';
import { isMarkingAvailable } from './functions/marks';
import { isTextAlignAvailable } from './functions/textAlign';
import { Headings } from './headings';
import { Lists } from './lists';
import { Marks } from './marks';
import { ToolbarSeparator } from './separator';
import { TextAligns } from './text-aligns';
import { ToolbarIconButton } from './toolbarbutton';

const ICON_SIZE = 24;

interface Props {
  visible: boolean;
}

export const EditorOppgavelinje = ({ visible }: Props) => {
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

      <ToolbarSeparator />

      <Headings />

      <ToolbarSeparator />

      <Lists iconSize={ICON_SIZE} />
      <TextAligns iconSize={ICON_SIZE} disabled={!textAlignAvailable} />
    </ToolbarStyle>
  );
};

const ToolbarStyle = styled.section<{ visible: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;
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
