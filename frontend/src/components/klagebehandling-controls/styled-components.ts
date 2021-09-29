import styled from 'styled-components';

export const ControlPanel = styled.header`
  padding: 0 1em;
  background-color: #e5e5e5;
  display: flex;
  justify-content: space-between;
  overflow: auto;
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const KlagebehandlingTools = styled.div`
  display: flex;
  align-items: center;
`;

export const KlagebehandlingInformation = styled.div`
  display: flex;
  align-items: center;
`;

export const ExternalLink = styled.a`
  span {
    color: #000;
  }
  margin: auto 20px auto 0;
`;

export const User = styled.ul`
  display: flex;
  list-style: none;
  margin-right: 20px;
  border-right: 1px solid #c9c9c9;
  padding: 0;
  margin: 0;
`;

export const UserItem = styled.li`
  padding-right: 1em;
  margin: auto 0;
  svg {
    display: block;
  }
`;

export const CopyFnrButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  padding: 5px;
  :hover {
    background: #ccc;
  }
`;

export const ToggleButtonsContainer = styled.div`
  display: flex;
  padding-left: 16px;
`;

export const StyledSaveStatus = styled.div`
  color: #6a6a6a;
  svg,
  span {
    vertical-align: middle;
  }
`;
