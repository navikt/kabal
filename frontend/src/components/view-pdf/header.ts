import { styled } from 'styled-components';

export const Header = styled.div`
  background-color: var(--a-green-100);
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  padding-top: var(--a-spacing-2);
  padding-bottom: var(--a-spacing-2);
  z-index: 1;
  column-gap: var(--a-spacing-1);
`;

export const StyledDocumentTitle = styled.h1`
  font-size: var(--a-spacing-4);
  font-weight: bold;
  margin: 0;
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
