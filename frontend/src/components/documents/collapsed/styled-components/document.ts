import styled from 'styled-components';

export const DocumentDate = styled.time`
  display: block;
  font-size: 14px;
`;

export const ViewDocumentButton = styled.button<{ tilknyttet: boolean; isActive: boolean }>`
  padding-bottom: 4px;
  display: block;
  cursor: pointer;
  padding: 0;
  border: none;
  background-color: transparent;
  color: #0067c5;
  font-size: 16px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-decoration: ${(props) => (props.tilknyttet ? 'none' : 'line-through')};
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};

  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;
