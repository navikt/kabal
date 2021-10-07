import styled from 'styled-components';

export const StyledMessagesContainer = styled.div`
  margin-bottom: 1em;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const StyledAuthor = styled.p`
  font-weight: bold;
  margin: 0;
`;
export const StyledMessageContent = styled.p`
  margin: 0;
  white-space: normal;
`;

export const StyledMessages = styled.div`
  margin-top: 1em;
`;

export const StyledHeader = styled.h3`
  margin-bottom: 0.25em;
`;

export const StyledMessage = styled.div`
  margin-top: 1em;
`;

export const StyledWriteMessage = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyleSendMessage = styled.div`
  align-self: flex-end;
`;
