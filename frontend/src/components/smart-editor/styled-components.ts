import { Editable } from 'slate-react';
import styled from 'styled-components';

export const EditorContainer = styled.section`
  position: relative;
  width: 798px;
  height: fit-content;
  padding-left: 1em;
  padding-right: 1em;
`;

interface StyledEditableProps {
  theme: {
    isFocused: boolean;
  };
}

export const StyledEditable = styled(Editable)<StyledEditableProps>`
  /* width: 210mm; */
  min-height: 150mm;
  border-bottom: 1px solid #c9c9c9;
  padding-left: 1em;
  padding-right: 1em;
  opacity: ${({ theme }) => (theme.isFocused === true ? 1 : 0.5)};
  position: relative;

  *::selection {
    background-color: lightblue;
  }
`;

export const CommentSectionContainer = styled.section``;
