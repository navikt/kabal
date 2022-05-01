import styled from 'styled-components';

export const PanelContainer = styled.section`
  display: flex;
  position: relative;
  min-width: fit-content;
  height: 100%;
  max-height: 100%;
  margin: 4px 8px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  overflow-x: hidden;
  white-space: nowrap;
  flex-direction: column;
  scroll-snap-align: start;
`;

export const PanelHeader = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 24px;
`;
