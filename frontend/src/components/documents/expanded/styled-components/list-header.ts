import styled from 'styled-components';
import { FilterDropdown } from '../../../filter-dropdown/filter-dropdown';
import { documentsGridCSS } from './grid';

export const StyledListHeader = styled.div`
  ${documentsGridCSS}
  padding-bottom: 16px;
  border-bottom: 1px solid #c6c2bf;
`;

export const StyledFilterDropdown = styled(FilterDropdown)`
  grid-area: meta;
`;
