import { styled } from 'styled-components';
import {
  LeafStyleProps,
  getCaretColor,
  getColor,
  getFontSize,
  getScriptDecoration,
  getTextDecoration,
} from './helpers';

export const StyledLeaf = styled.span<LeafStyleProps>`
  font-weight: ${({ bold }) => (bold === true ? '700' : 'auto')};
  font-style: ${({ italic }) => (italic === true ? 'italic' : 'normal')};
  font-size: ${getFontSize};
  text-decoration: ${getTextDecoration};
  vertical-align: ${getScriptDecoration};
  background-color: ${({ commentIds, selected = false, focused = false }) =>
    getColor(commentIds.length, selected, focused)};
  box-shadow: 0 0 0 0.66px ${({ selected = false, isExpanded }) => getCaretColor(selected, isExpanded)};
  // The following is a workaround for a Chromium bug where,
  // if you have an inline at the end of a block,
  // clicking the end of a block puts the cursor inside the inline
  // instead of inside the final {text: ''} node
  // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
  padding-left: ${({ hasText }) => (hasText ? '0' : '0.1px')};
`;
