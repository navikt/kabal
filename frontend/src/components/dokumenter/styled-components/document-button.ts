import styled from 'styled-components';

export const DocumentButton = styled.button<{ isActive: boolean }>`
  display: block;
  cursor: pointer;
  border: none;
  padding: 0;
  font-size: inherit;
  background-color: transparent;
  width: 100%;
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
