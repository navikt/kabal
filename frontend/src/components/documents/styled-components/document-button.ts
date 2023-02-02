import styled from 'styled-components';

export const StyledDocumentButton = styled.button<{ isActive: boolean }>`
  cursor: pointer;
  border: none;
  padding: 0;
  font-size: inherit;
  background-color: transparent;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 1.25;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  text-decoration: none;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  color: #0067c5;
  height: 100%;
  user-select: text;

  :hover {
    color: #262626;
  }

  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;
