import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
import { TitleAction } from '@app/components/documents/new-documents/new-document/title-action';

export const StyledDocumentTitle = styled.h1`
  grid-area: ${Fields.Title};
  display: flex;
  flex-direction: row;
  column-gap: var(--a-spacing-2);
  font-size: 18px;
  font-weight: normal;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  height: 100%;
  min-width: 100px;
`;

export const StyledTitleAction = styled(TitleAction)`
  display: none;

  ${StyledDocumentTitle}:hover & {
    display: flex;
  }
`;
