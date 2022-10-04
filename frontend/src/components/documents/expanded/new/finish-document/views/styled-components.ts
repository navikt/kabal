import styled from 'styled-components';

export const StyledFinishDocument = styled.section`
  position: absolute;
  right: 0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background: white;
  padding: 16px;
  max-width: 500px;
  min-width: 300px;
  z-index: 5;
`;

export const StyledButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

export const StyledBrevmottakerList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: bold;
  margin: 0;
  margin-top: 8px;
  white-space: normal;
  list-style: none;
  padding-left: 0;
`;

export const StyledBrevmottaker = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const StyledHeader = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  margin-bottom: 8px;
`;

export const StyledMainText = styled.p`
  margin: 0;
  white-space: normal;
`;
