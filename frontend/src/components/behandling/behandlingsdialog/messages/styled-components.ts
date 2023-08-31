import { styled } from 'styled-components';

export const StyledMessagesContainer = styled.section`
  padding-bottom: 16px;
`;

export const StyledAuthor = styled.p`
  font-weight: bold;
  margin: 0;
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

export const StyledWriteMessage = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyleSendMessage = styled.div`
  align-self: flex-end;
  margin-top: 8px;
`;
