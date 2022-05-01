import styled from 'styled-components';

export const EditorContainer = styled.div<{ isActive: boolean }>`
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
  flex-direction: row;
  position: relative;
  width: 100%;
  overflow-y: hidden;
  flex-grow: 1;
`;

export const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
  border-bottom: 1px solid lightgrey;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: fit-content;
`;

export const TabButton = styled.button`
  background-color: transparent;
  border: none;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin: 0;
  cursor: pointer;
  border-radius: 4px;

  :hover {
    background-color: #f5f5f5;
  }
`;

export const ActiveTabButton = styled(TabButton)`
  background-color: lightgrey;
`;
