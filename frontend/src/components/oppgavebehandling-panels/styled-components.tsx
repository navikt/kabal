import { styled } from 'styled-components';

export const PanelContainer = styled.section`
  display: flex;
  position: relative;
  min-width: fit-content;
  height: 100%;
  max-height: 100%;
  background: white;
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);
  overflow-x: hidden;
  flex-direction: column;
`;

export const PageContainer = styled.main`
  display: flex;
  flex-direction: row;
  column-gap: 12px;
  padding-bottom: 12px;
  padding-top: 8px;
  padding-left: 8px;
  padding-right: 8px;
  width: 100%;
  flex-grow: 1;
  overflow-x: scroll;
  overflow-y: hidden;
  background-color: var(--a-bg-subtle);
`;
