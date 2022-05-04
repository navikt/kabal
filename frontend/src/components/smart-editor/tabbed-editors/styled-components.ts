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
  box-shadow: inset 0px -1px 0px 0px rgb(155, 155, 155);
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: fit-content;
`;

export const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: transparent;
  border: none;
  color: rgb(112, 112, 112);
  box-shadow: inset 0px -1px 0 0 rgb(155, 155, 155);
  transition-property: box-shadow, color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin: 0;
  line-height: 1;
  font-size: 16px;
  height: 40px;
  cursor: pointer;

  :hover {
    color: rgb(38, 38, 38);
    box-shadow: inset 0px -3px 0 0 rgb(155, 155, 155);
  }
`;

export const ActiveTabButton = styled(TabButton)`
  color: rgb(38, 38, 38);
  box-shadow: inset 0px -3px 0 0 rgb(0, 52, 125);
`;
