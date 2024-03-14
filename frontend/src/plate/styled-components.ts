import { css, styled } from 'styled-components';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';

const positioned = css`
  grid-template-areas:
    'content counters counters'
    'content bookmarks comments'
    'padding bookmarks comments';
  grid-template-columns: min-content min-content min-content;
  grid-template-rows: min-content 1fr minmax(200px, min-content);
`;

const sticky = css`
  grid-template-areas:
    'content right'
    'padding right';
  grid-template-columns: min-content min-content;
  grid-template-rows: 1fr minmax(200px, min-content);
`;

export const PlateEditorContent = styled.div<{ $showAnnotationsAtOrigin: boolean }>`
  display: grid;
  ${({ $showAnnotationsAtOrigin }) => ($showAnnotationsAtOrigin ? positioned : sticky)}
  overflow: visible;
  scroll-padding-top: 64px;
  padding-top: 16px;
  position: relative;
  text-underline-offset: 0.25em; // To match PDF.
  word-wrap: normal;
  word-break: normal;
  height: max-content;

  &::after {
    grid-area: padding;
    content: '';
    padding-bottom: calc(20mm * var(${EDITOR_SCALE_CSS_VAR}) + 100px);
  }
`;
