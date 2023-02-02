import styled, { css } from 'styled-components';
import { FilterDropdown } from '../../../filter-dropdown/filter-dropdown';
import { Fields, journalfoerteDocumentsHeaderGridCSS, newDocumentsGridCSS } from './grid';

const listHeaderCSS = css`
  padding-bottom: 16px;
  border-bottom: 1px solid #c6c2bf;
`;

export const NewDocumentsStyledListHeader = styled.div`
  ${listHeaderCSS}
  ${newDocumentsGridCSS}
`;

export const JournalfoerteDocumentsStyledListHeader = styled.div`
  ${listHeaderCSS}
  ${journalfoerteDocumentsHeaderGridCSS}
`;

export const StyledFilterDropdown = styled(FilterDropdown)<{ $area: Fields }>`
  grid-area: ${({ $area }) => $area};
`;
