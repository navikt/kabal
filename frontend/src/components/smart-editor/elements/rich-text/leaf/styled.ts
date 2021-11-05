import styled from 'styled-components';
import { IMarks } from '../../../editor-types';
import { getColor, getFontSize, getScriptDecoration, getTextDecoration } from './helpers';

export interface LeafStyleProps extends IMarks {
  selected?: boolean;
  focused?: boolean;
  commentIds: string[];
  children: React.ReactNode;
}

export const StyledLeaf = styled.span<LeafStyleProps>`
  font-weight: ${({ bold }) => (bold === true ? '700' : 'auto')};
  font-style: ${({ italic }) => (italic === true ? 'italic' : 'normal')};
  font-size: ${getFontSize};
  text-decoration: ${getTextDecoration};
  vertical-align: ${getScriptDecoration};
  background-color: ${({ commentIds, selected = false, focused = false }) =>
    getColor(commentIds.length, selected, focused)};
`;
