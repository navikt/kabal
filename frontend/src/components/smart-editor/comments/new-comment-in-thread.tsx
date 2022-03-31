import { Knapp } from 'nav-frontend-knapper';
import { Textarea } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetBrukerQuery, useGetMySignatureQuery } from '../../../redux-api/bruker';
import { usePostReplyMutation } from '../../../redux-api/smart-editor-comments';
import { SmartEditorContext } from '../context/smart-editor-context';
import { StyledCommentButton, StyledCommentButtonContainer, StyledNewCommentInThread } from './styled-components';

interface NewCommentInThreadProps {
  threadId: string;
  isFocused: boolean;
  close: () => void;
  onFocus: () => void;
}

export const NewCommentInThread = ({ threadId, isFocused, close, onFocus }: NewCommentInThreadProps) => {
  const { data: bruker, isLoading: brukerIsLoading } = useGetBrukerQuery();
  const { data: signature } = useGetMySignatureQuery();
  const [postReply, { isLoading }] = usePostReplyMutation();
  const oppgaveId = useOppgaveId();
  const { documentId } = useContext(SmartEditorContext);

  const [text, setText] = useState<string>('');

  if (typeof bruker === 'undefined' || brukerIsLoading || typeof signature === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const onSubmit = () => {
    if (documentId === null || text.length <= 0) {
      return;
    }

    postReply({
      oppgaveId,
      author: {
        ident: bruker.navIdent,
        name: signature?.customLongName ?? signature.longName,
      },
      dokumentId: documentId,
      text,
      commentId: threadId,
    }).then(() => {
      setText('');
    });
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <StyledNewCommentInThread>
      <StyledTextAreaContainer isFocused={isFocused}>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Svar"
          maxLength={0}
          onFocus={onFocus}
          disabled={isLoading}
        />
      </StyledTextAreaContainer>
      <Buttons show={isFocused} close={close} onSubmit={onSubmit} text={text} isLoading={isLoading} />
    </StyledNewCommentInThread>
  );
};

interface ButtonsProps {
  show: boolean;
  close: () => void;
  onSubmit: () => void;
  text: string;
  isLoading: boolean;
}

const Buttons = ({ show, text, isLoading, close, onSubmit }: ButtonsProps) => {
  if (!show) {
    return null;
  }

  return (
    <StyledCommentButtonContainer>
      <StyledCommentButton
        mini
        onClick={onSubmit}
        disabled={text.length <= 0}
        spinner={isLoading}
        autoDisableVedSpinner
      >
        Legg til
      </StyledCommentButton>
      <Knapp mini onClick={close} disabled={isLoading}>
        Avbryt
      </Knapp>
    </StyledCommentButtonContainer>
  );
};

const StyledTextAreaContainer = styled.div<{ isFocused: boolean }>`
  height: ${({ isFocused }) => (isFocused ? 'auto' : '0px')};
  overflow: hidden;
`;
