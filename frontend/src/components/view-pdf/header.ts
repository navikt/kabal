import styled from 'styled-components';

export const Header = styled.div`
  background: var(--a-green-100);
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  z-index: 1;
  column-gap: 4px;
`;

export const StyledDocumentTitle = styled.h1`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  padding-left: 8px;
  padding-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
