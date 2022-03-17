import { Editable } from 'slate-react';
import styled from 'styled-components';

export const EditorContainer = styled.section`
  position: relative;
  width: 100%;
  margin-top: 0;
  overflow: visible;
`;

export const StyledEditable = styled(Editable)<{ isFocused: boolean }>`
  min-height: 64px;
  position: relative;
  padding: 16px;
  box-shadow: -5px 0px 0 0px ${({ isFocused }) => (isFocused ? '#00bcd4' : '#c9c9c9')};
  border-radius: 5px;
  transition: box-shadow 0.2s ease-in-out;

  > :first-child {
    margin-top: 0;
  }

  *::selection {
    background-color: lightblue;
  }
`;

export const CommentSectionContainer = styled.section``;
