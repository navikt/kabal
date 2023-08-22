import { styled } from 'styled-components';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';

export const PlateEditorContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 0;
  position: relative;
  text-underline-offset: 0.25em; // To match PDF.
  word-wrap: normal;
  word-break: normal;
  hyphens: auto;

  &::after {
    content: '';
    padding-bottom: calc(20mm * var(${EDITOR_SCALE_CSS_VAR}) + 33px);
  }
`;
