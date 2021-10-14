import styled from 'styled-components';

const BREAKPOINT = '1024px';

export const ControlPanel = styled.header`
  padding: 0 1em;
  background-color: #f8f8f8;
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #c9c9c9;

  @media (max-width: ${BREAKPOINT}) {
    align-items: flex-start;
  }
`;

export const KlagebehandlingTools = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${BREAKPOINT}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const KlagebehandlingInformation = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${BREAKPOINT}) {
    margin-top: 8px;
  }
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

  @media (max-width: ${BREAKPOINT}) {
    border-right: 0;
  }
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
  margin-left: 24px;

  @media (max-width: ${BREAKPOINT}) {
    margin-left: 0;
    margin-top: 8px;
  }
`;
