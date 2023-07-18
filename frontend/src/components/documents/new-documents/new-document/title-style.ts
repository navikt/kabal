import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
import { TitleAction } from '@app/components/documents/new-documents/new-document/title-action';

export const StyledDocumentTitle = styled.h1`
  grid-area: ${Fields.Title};
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

export const StyledTitleAction = styled(TitleAction)`
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.2s ease-in-out;

  ${StyledDocumentTitle}:hover & {
    opacity: 1;
  }
`;
