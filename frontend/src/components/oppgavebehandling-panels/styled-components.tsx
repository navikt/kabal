import { styled } from 'styled-components';

export const PanelContainer = styled.section`
  display: flex;
  position: relative;
  min-width: fit-content;
  height: 100%;
  max-height: 100%;
  background-color: var(--a-bg-default);
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);
  overflow-x: hidden;
  flex-direction: column;
`;

export const PageContainer = styled.main`
  display: flex;
  flex-direction: row;
  column-gap: var(--a-spacing-3);
  padding-bottom: var(--a-spacing-3);
  padding-top: var(--a-spacing-2);
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  width: 100%;
  flex-grow: 1;
  overflow-x: scroll;
  overflow-y: hidden;
  background-color: var(--a-bg-subtle);
`;
