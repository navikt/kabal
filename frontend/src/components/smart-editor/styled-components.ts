import { Editable } from 'slate-react';
import styled from 'styled-components';

export const EditorContainer = styled.section`
  position: relative;
  width: 100%;
  padding: 0;
  overflow-y: auto;
`;

interface StyledEditableProps {
  theme: {
    isFocused: boolean;
  };
}

export const StyledEditable = styled(Editable)<StyledEditableProps>`
  min-height: 150mm;
  border: 1px solid #c9c9c9;
  padding: 2em;
  opacity: ${({ theme }) => (theme.isFocused === true ? 1 : 0.5)};
  position: relative;
  *::selection {
    background-color: lightblue;
  }
`;

export const CommentSectionContainer = styled.section``;
