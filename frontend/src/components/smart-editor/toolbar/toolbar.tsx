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

export const EditorOppgavelinje = () => {
  const editor = useSlate();

  const marksAvailable = isMarkingAvailable(editor);
  const textAlignAvailable = isTextAlignAvailable(editor);

  return (
    <ToolbarStyle>
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

const ToolbarStyle = styled.section`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  padding: 0.5em;
  border-bottom: 1px solid #c9c9c9;
  overflow: hidden;
`;
