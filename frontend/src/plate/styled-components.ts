import { styled } from 'styled-components';

export const PlateEditorContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 0;
  background: var(--a-bg-subtle);
  position: relative;
  text-underline-offset: 0.25em; // To match PDF.
  word-wrap: normal;
  word-break: normal;
  hyphens: auto;

  &::after {
    content: '';
    padding-bottom: 20mm;
  }
`;
