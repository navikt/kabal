import { Editable } from 'slate-react';
import styled from 'styled-components';

export const EditorContainer = styled.section`
  position: relative;
  width: 100%;
  margin-top: 0;
  overflow: visible;
  display: flex;
  flex-direction: column;
`;

export const StyledEditable = styled(Editable)<{ 'data-is-focused': boolean; readOnly: boolean }>`
  min-height: 64px;
  width: 100%;
  position: relative;
  padding-top: 16px;
  padding-left: 20mm;
  padding-right: 20mm;
  padding-bottom: 32px;
  color: ${({ readOnly }) => (readOnly ? '#999' : '#000')};
  cursor: ${({ readOnly }) => (readOnly ? 'not-allowed' : 'unset')};

  > :first-child {
    margin-top: 0;
  }

  *::selection {
    background-color: lightblue;
  }
`;
