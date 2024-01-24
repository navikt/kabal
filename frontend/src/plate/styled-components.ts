import { styled } from 'styled-components';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';

export const PlateEditorContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: visible;
  scroll-padding-top: 64px;
  padding-top: 16px;
  position: relative;
  text-underline-offset: 0.25em; // To match PDF.
  word-wrap: normal;
  word-break: normal;
  max-height: 100%;

  &::after {
    content: '';
    padding-bottom: calc(20mm * var(${EDITOR_SCALE_CSS_VAR}) + 33px);
  }
`;
