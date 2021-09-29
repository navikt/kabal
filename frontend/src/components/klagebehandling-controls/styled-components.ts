import styled from 'styled-components';

export const ControlPanel = styled.header`
  padding: 1em 0;
  background-color: #e5e5e5;
  display: flex;
  justify-content: space-between;
`;

export const ControlPanelLeftSide = styled.div`
  display: flex;
`;
export const ControlPanelRightSide = styled.div`
  display: flex;
`;

export const User = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding-left: 20px;
  border-right: 1px solid #c9c9c9;
`;

export const UserItem = styled.li`
  padding-right: 1em;
  margin: auto 0;
`;

export const ToggleButtonsContainer = styled.div`
  display: flex;
  button {
    margin-right: 5px;
  }
`;
