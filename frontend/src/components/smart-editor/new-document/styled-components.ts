import { styled } from 'styled-components';

export const StyledTemplateButton = styled.button`
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  border: none;
  padding: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-radius: var(--a-border-radius-medium);
  width: 25%;
  min-width: 190px;

  &:hover {
    background: var(--a-surface-hover);
  }
`;

export const StyledNewDocument = styled.section`
  width: 826px;
  height: 100%;
  padding: 32px;
  padding-top: 16px;
  background: var(--a-bg-default);
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
  background: rgba(0, 0, 0, 0.25);
  top: 0;
`;
