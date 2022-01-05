import styled from 'styled-components';
import { LeafStyleProps, getColor, getFontSize, getScriptDecoration, getTextDecoration } from './helpers';

export const StyledLeaf = styled.span<LeafStyleProps>`
  font-weight: ${({ bold }) => (bold === true ? '700' : 'auto')};
  font-style: ${({ italic }) => (italic === true ? 'italic' : 'normal')};
  font-size: ${getFontSize};
  text-decoration: ${getTextDecoration};
  vertical-align: ${getScriptDecoration};
  background-color: ${({ commentIds, selected = false, focused = false }) =>
    getColor(commentIds.length, selected, focused)};
`;
