import styled from 'styled-components';
import { documentsGridCSS } from './grid';

export const StyledDocument = styled.article`
  ${documentsGridCSS}
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

export const StyledDocumentTitle = styled.h1`
  display: flex;
  flex-direction: row;
  gap: 0;
  font-size: 16px;
  font-weight: normal;
  margin: 0;
  color: #0067c5;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 100%;
`;

export const StyledDate = styled.time`
  grid-area: date;
  font-size: 12px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
`;
