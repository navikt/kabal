import { css, styled } from 'styled-components';

const StyledDocumentListItem = styled.li`
  display: block;
  margin-left: var(--a-spacing-05);
  margin-right: var(--a-spacing-05);
  border-radius: var(--a-border-radius-medium);
`;

export const StyledAttachmentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0;
  grid-column-end: action-end;
  grid-column-start: title-start;
  position: relative;
  padding: 0;
  margin: 0;
  margin-left: 14px;
  list-style-type: none;
`;

const treeRootStructureCss = css`
  content: '';
  display: block;
  width: 0;
  position: absolute;
  top: 0;
  border-left: 1px solid var(--a-border-subtle);
`;

export const JournalfoerteDocumentsAttachments = styled(StyledAttachmentList)<{ $treeLineHeight: number }>`
  position: absolute;
  right: 0;
  margin-left: 0;

  &::before {
    ${treeRootStructureCss}
    height: ${({ $treeLineHeight }) => $treeLineHeight}px;
    left: 0;
  }
`;

export const NewDocAttachmentsContainer = styled.div<{ $showTreeLine: boolean }>`
  position: relative;

  &::before {
    ${treeRootStructureCss}
    display: ${({ $showTreeLine }) => ($showTreeLine ? 'block' : 'none')};
    bottom: 15px;
    left: 14px;
  }
`;

export const StyledNewAttachmentListItem: typeof StyledDocumentListItem = styled(StyledDocumentListItem)`
  position: absolute;
  left: 0;
  right: 0;
  padding-left: var(--a-spacing-4);
  padding-right: var(--a-spacing-1-alt);
  margin-left: 0;
  margin-right: 0;

  &::before {
    content: '';
    display: block;
    width: var(--a-spacing-3);
    position: absolute;
    left: 0;
    top: var(--a-spacing-4);
    border-bottom: 1px solid var(--a-border-subtle);
  }
`;

export const StyledAttachmentListItem: typeof StyledDocumentListItem = styled(StyledDocumentListItem)`
  position: absolute;
  left: 0;
  right: 0;
  padding-left: var(--a-spacing-4);
  margin-left: 0;
  margin-right: 0;

  &::before {
    content: '';
    display: block;
    width: var(--a-spacing-3);
    position: absolute;
    left: 0;
    top: var(--a-spacing-4);
    border-bottom: 1px solid var(--a-border-subtle);
  }
`;

export const LogiskeVedleggListStyle = styled.ul<{ $connectTop: number }>`
  position: absolute;
  right: 0;
  padding: 0;
  margin: 0;

  &::before {
    content: '';
    display: block;
    width: 1px;
    position: absolute;
    top: ${({ $connectTop }) => -$connectTop}px;
    height: ${({ $connectTop }) => $connectTop - 4}px;
    left: 0;
    background-color: var(--a-border-subtle);
  }
`;

export const LogiskeVedleggListItemStyle = styled.li<{ $connected: boolean; $paddingLeft?: number }>`
  position: absolute;
  left: 0;
  right: 0;
  padding-left: ${({ $paddingLeft = 16 }) => $paddingLeft}px;
  display: flex;
  justify-content: flex-start;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: -4px;
    bottom: ${({ $connected }) => ($connected ? '0' : '11px')};
    width: var(--a-spacing-3);
    border-left: 1px solid var(--a-border-subtle);
  }

  &::after {
    content: '';
    position: absolute;
    left: 1px;
    top: var(--a-spacing-3);
    height: 1px;
    width: var(--a-spacing-3);
    background-color: var(--a-border-subtle);
  }
`;
