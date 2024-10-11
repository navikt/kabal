import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { BASE_FONT_SIZE } from '@app/plate/components/get-scaled-em';
import { styled } from 'styled-components';

interface Props {
  $minHeight: boolean;
}

export const Sheet = styled.div<Props>`
  position: relative;
  background-color: var(--a-bg-default);
  flex-shrink: 0;
  margin-top: var(--a-spacing-4);
  box-shadow: var(--a-shadow-xlarge);

  &:first-of-type {
    margin-top: 0;
  }

  // Scaled rules
  width: calc(var(${EDITOR_SCALE_CSS_VAR}) * 210mm);
  min-height: ${({ $minHeight }) => ($minHeight ? `calc(var(${EDITOR_SCALE_CSS_VAR}) * 297mm)` : 'unset')};
  padding-left: calc(var(${EDITOR_SCALE_CSS_VAR}) * 20mm);
  padding-right: calc(var(${EDITOR_SCALE_CSS_VAR}) * 20mm);
  padding-bottom: calc(var(${EDITOR_SCALE_CSS_VAR}) * 20mm);
  padding-top: calc(var(${EDITOR_SCALE_CSS_VAR}) * 15mm);
  font-size: calc(var(${EDITOR_SCALE_CSS_VAR}) * ${BASE_FONT_SIZE}pt);
`;
