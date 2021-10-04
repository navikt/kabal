import styled from 'styled-components';

interface PanelContainerProps {
  width?: number;
}

export const PanelContainer = styled.section<PanelContainerProps>`
  display: block;
  min-width: ${({ width = null }) => (width === null ? 'auto' : `${width}em`)};
  margin: 0.25em 0.5em;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  width: auto;
  height: 100%;
  white-space: nowrap;
`;
