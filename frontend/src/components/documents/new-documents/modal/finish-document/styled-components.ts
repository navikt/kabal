import { styled } from 'styled-components';

export const StyledFinishDocument = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  position: relative;
`;

export const StyledButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  column-gap: 16px;
`;

export const StyledBrevmottaker = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding-left: 8px;
  padding-right: 8px;
  min-height: 32px;
`;

export const StyledRecipientContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
`;
