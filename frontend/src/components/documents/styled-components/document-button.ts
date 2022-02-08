import styled from 'styled-components';

export const StyledDocumentButton = styled.button<{ isActive: boolean }>`
  display: block;
  cursor: pointer;
  border: none;
  padding: 0;
  font-size: inherit;
  background-color: transparent;
  padding-top: 5px;
  padding-bottom: 5px;
  line-height: 1.375;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  text-decoration: none;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  color: #0067c5;

  &:hover {
    color: #262626;
  }
`;
