import styled from 'styled-components';

export const StyledFinishDocument = styled.section`
  position: relative;
`;

export const StyledButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  column-gap: 16px;
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
