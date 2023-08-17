import { styled } from 'styled-components';

export const PanelContainer = styled.section`
  display: flex;
  position: relative;
  min-width: fit-content;
  height: 100%;
  max-height: 100%;
  margin: 4px 8px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: var(--a-border-radius-medium);
  overflow-x: hidden;
  flex-direction: column;
`;

export const PageContainer = styled.main`
  display: flex;
  width: 100%;
  margin: 0 0.25em 0 0;
  flex-grow: 1;
  overflow-x: scroll;
  overflow-y: hidden;
  padding-bottom: 1em;
  padding-left: 8px;
  padding-right: 8px;
  background-color: #e5e5e5;
`;
