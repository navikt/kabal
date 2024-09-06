import { styled } from 'styled-components';

export const StyledFinishDocument = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-4);
  position: relative;
`;

export const StyledButtons = styled.div`
  display: flex;
  justify-content: flex-start;
  column-gap: var(--a-spacing-4);
`;

export const StyledBrevmottaker = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--a-spacing-2);
  flex-shrink: 0;
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  min-height: var(--a-spacing-8);
`;

export const StyledRecipientContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--a-spacing-1);
  align-items: center;
`;
