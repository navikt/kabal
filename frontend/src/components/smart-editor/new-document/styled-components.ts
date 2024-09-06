import { styled } from 'styled-components';

export const StyledTemplateButton = styled.button`
  background-color: transparent;
  font-size: var(--a-spacing-4);
  font-weight: 600;
  border: none;
  padding: var(--a-spacing-4);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-radius: var(--a-border-radius-medium);
  width: 25%;
  min-width: 190px;

  &:hover {
    background-color: var(--a-surface-hover);
  }
`;

export const StyledNewDocument = styled.section`
  width: 826px;
  height: 100%;
  padding: var(--a-spacing-8);
  padding-top: var(--a-spacing-4);
  background-color: var(--a-bg-default);
  overflow-y: auto;
`;

export const StyledTemplates = styled.section`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

export const StyledHeader = styled.h2`
  margin: 0;
  margin-bottom: 1em;
`;

export const StyledLoadingOverlay = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  top: 0;
`;
