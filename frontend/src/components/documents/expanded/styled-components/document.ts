import styled, { css } from 'styled-components';
import { journalfoerteDocumentsGridCSS, newDocumentsGridCSS, vedleggGridCSS } from './grid';

const documentCSS = css`
  position: relative;
  width: 100%;
  padding-right: 0;
  border-radius: 4px;
  background-color: transparent;
  transition: background-color 0.2s ease-in-out;
  min-height: 34.5px;
`;

export const StyledNewDocument = styled.article`
  ${documentCSS}
  ${newDocumentsGridCSS}

  :hover {
    background-color: var(--a-surface-hover);
  }
`;

export const StyledVedlegg = styled.article<{ $selected: boolean }>`
  ${documentCSS}
  ${vedleggGridCSS}

  background-color: ${({ $selected }) => getBackgroundColor(false, $selected)};

  :hover {
    background-color: ${({ $selected }) => getHoverBackgroundColor(false, $selected)};
  }
`;

export const StyledJournalfoertDocument = styled.article<{ $expanded: boolean; $selected: boolean }>`
  ${documentCSS}
  ${journalfoerteDocumentsGridCSS}
  background-color: ${({ $expanded, $selected }) => getBackgroundColor($expanded, $selected)};

  :hover {
    background-color: ${({ $expanded, $selected }) => getHoverBackgroundColor($expanded, $selected)};
  }
`;

export const StyledDocumentTitle = styled.h1`
  grid-area: title;
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  font-size: 18px;
  font-weight: normal;
  margin: 0;
  color: #0067c5;
  overflow: hidden;
  white-space: nowrap;
  height: 100%;
`;

export const StyledDate = styled.time`
  grid-area: date;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const getBackgroundColor = (expanded: boolean, selected: boolean) => {
  if (expanded) {
    return 'var(--a-surface-subtle)';
  }

  if (selected) {
    return 'var(--a-surface-selected)';
  }

  return 'transparent';
};

const getHoverBackgroundColor = (expanded: boolean, selected: boolean) => {
  if (expanded) {
    return 'var(--a-surface-subtle)';
  }

  if (selected) {
    return 'var(--a-surface-action-subtle-hover)';
  }

  return 'var(--a-surface-hover)';
};
