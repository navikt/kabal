import { PADDING_BOTTOM, PADDING_TOP, ROW_GAP } from '@app/components/documents/new-documents/constants';
import { styled } from 'styled-components';

export const StyledDocumentList = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: ${ROW_GAP}px;
  padding: 0;
  padding-top: ${PADDING_TOP}px;
  padding-bottom: ${PADDING_BOTTOM}px;
  margin: 0;
  list-style-type: none;
  flex-grow: 1;
  overflow-y: hidden;
`;

export const Container = styled.div`
  overflow: auto;
  position: relative;
  flex-grow: 1;
`;
