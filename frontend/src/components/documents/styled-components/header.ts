import styled from 'styled-components';

export const DocumentsHeader = styled.div`
  display: flex;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 1em;
  background: white;
  border-bottom: 1px solid #c6c2bf;
  height: 64px;
  align-items: center;
  margin-bottom: 16px;
`;

export const DocumentsTitle = styled.h1`
  padding: 0;
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
  flex-grow: 1;
  line-height: 1;
`;

export const ExpandCollapseButton = styled.button`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  width: 32px;
  background-color: transparent;
  border: none;
  border-radius: 0;
  font-size: 20px;
`;
