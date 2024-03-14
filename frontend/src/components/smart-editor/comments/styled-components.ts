import { styled } from 'styled-components';

export const StyledNewReply = styled.div`
  border-radius: var(--a-border-radius-medium);
  font-size: 16px;
`;

export const StyledNewThread = styled.div`
  position: absolute;
  right: -2px;
  transform: translateX(100%);
  width: ${350 - 12 - 12}px;
  background-color: white;
  z-index: 5;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 16px;
  margin-bottom: 40px;
  border-radius: var(--a-border-radius-medium);
  border: 1px solid #c9c9c9;
`;

export const StyledCommentButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
  margin-right: 20px;
  width: 100%;
`;
