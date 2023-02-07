import styled, { css } from 'styled-components';
import { journalfoerteDocumentsGridCSS, newDocumentsGridCSS, vedleggGridCSS } from './grid';

const documentCSS = css`
  position: relative;
  width: 100%;
  padding-right: 0;
  border-radius: 4px;
  background-color: #fff;
  transition: background-color 0.2s ease-in-out;
  min-height: 34.5px;

  :hover {
    background-color: #f5f5f5;
  }
`;

export const StyledNewDocument = styled.article`
  ${documentCSS}
  ${newDocumentsGridCSS}
`;

export const StyledVedlegg = styled.article`
  ${documentCSS}
  ${vedleggGridCSS}
`;

export const StyledJournalfoertDocument = styled.article<{ $expanded: boolean }>`
  ${documentCSS}
  ${journalfoerteDocumentsGridCSS}
  background-color: ${({ $expanded }) => ($expanded ? 'var(--a-surface-subtle)' : 'tranparent')};
`;

export const StyledDocumentTitle = styled.h1`
  grid-area: title;
  display: flex;
  flex-direction: row;
  gap: 0;
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
