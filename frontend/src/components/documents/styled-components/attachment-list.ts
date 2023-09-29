import { css, styled } from 'styled-components';

const StyledDocumentListItem = styled.li`
  display: block;
  margin-left: 2px;
  margin-right: 2px;
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
  margin-left: 12px;
  list-style-type: none;
`;

const treeRootStructureCss = css`
  content: '';
  display: block;
  width: 0;
  position: absolute;
  top: 0;
  bottom: 16px;
  border-left: 1px solid var(--a-border-subtle);
`;

export const JournalfoerteDocumentsAttachments = styled(StyledAttachmentList)`
  position: relative;

  &::before {
    ${treeRootStructureCss}
    left: 4px;
  }
`;

export const NewDocAttachmentsContainer = styled.div<{ $showTreeLine: boolean }>`
  position: relative;

  &::before {
    ${treeRootStructureCss}
    display: ${({ $showTreeLine }) => ($showTreeLine ? 'block' : 'none')};
    left: 16px;
  }
`;

export const StyledAttachmentListItem = styled(StyledDocumentListItem)`
  position: relative;
  padding-left: 16px;
  margin-left: 0;
  margin-right: 0;

  &::before {
    content: '';
    display: block;
    width: 12px;
    position: absolute;
    left: 4px;
    top: 50%;
    border-bottom: 1px solid var(--a-border-subtle);
  }
`;
