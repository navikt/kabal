import { styled } from 'styled-components';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';

export const StyledDocumentTitle = styled.h1`
  grid-area: ${Fields.Title};
  display: flex;
  align-items: center;
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
