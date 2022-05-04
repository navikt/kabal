import styled from 'styled-components';

export interface StyledDropdownProps {
  top?: string | number;
  left?: string | number;
  maxHeight?: string | number;
}

export const StyledDropdown = styled.div<StyledDropdownProps>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: ${({ top = '100%' }) => top};
  left: ${({ left = 0 }) => left};
  padding: 0;
  margin: 0;
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
  z-index: 1;
  width: 100%;
  min-width: 275px;
  max-height: ${({ maxHeight = '256px' }) => maxHeight};
`;

export const StyledOptionList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const StyledSectionList = styled(StyledOptionList)`
  overflow-y: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

export const StyledListItem = styled.li`
  margin: 0;
  padding: 0;
  width: 100%;
`;

export const StyledTopListItem = styled.div`
  border-bottom: 1px solid #c6c2bf;
  background-color: white;
  padding: 8px;
  display: flex;
  justify-content: space-between;
`;

export const StyledHeader = styled(StyledTopListItem)`
  position: sticky;
  top: 0;
`;

export const StyledSectionHeader = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-left: 1em;
  margin-top: 1em;
  margin-bottom: 0.5em;
`;
