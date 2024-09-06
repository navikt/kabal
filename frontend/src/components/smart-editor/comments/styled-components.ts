import { styled } from 'styled-components';

export const StyledNewReply = styled.div`
  border-radius: var(--a-border-radius-medium);
  font-size: var(--a-spacing-4);
`;

export const StyledNewThread = styled.div`
  position: absolute;
  right: -2px;
  transform: translateX(100%);
  width: ${350 - 12 - 12}px;
  background-color: var(--a-bg-default);
  z-index: 5;
  box-shadow: var(--a-shadow-medium);
  padding: var(--a-spacing-4);
  margin-bottom: var(--a-spacing-10);
  border-radius: var(--a-border-radius-medium);
  border: 1px solid #c9c9c9;
`;

export const StyledCommentButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--a-spacing-4);
  margin-top: var(--a-spacing-4);
  margin-right: var(--a-spacing-5);
  width: 100%;
`;
