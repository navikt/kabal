import { styled } from 'styled-components';

export const StyledMessagesContainer = styled.section`
  padding-bottom: var(--a-spacing-4);
`;

export const StyledAuthor = styled.p`
  font-weight: bold;
  margin: 0;
`;

export const StyledTime = styled.time`
  font-size: var(--a-font-size-small);
  font-style: italic;
`;

export const StyledMessageContent = styled.p`
  margin: 0;
  white-space: pre-line;
  word-wrap: break-word;
`;

export const StyledMessages = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const StyledMessage = styled.li`
  margin-top: 1em;
`;

export const StyleSendMessage = styled.div`
  align-self: flex-end;
  margin-top: var(--a-spacing-2);
`;
