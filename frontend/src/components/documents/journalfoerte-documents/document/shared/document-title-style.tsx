import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { styled } from 'styled-components';

export const StyledDocumentTitle = styled.h1`
  grid-area: ${Fields.Title};
  display: flex;
  align-items: center;
  flex-direction: row;
  column-gap: var(--a-spacing-2);
  font-size: 18px;
  font-weight: normal;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  height: 100%;
`;
