import { Close, SuccessStroke } from '@navikt/ds-icons';
import { Button, Loader, Textarea } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetMySignatureQuery } from '../../../redux-api/bruker';
import { usePostReplyMutation } from '../../../redux-api/smart-editor-comments';
import { useUser } from '../../../simple-api-state/use-user';
import { SmartEditorContext } from '../context/smart-editor-context';
import { StyledCommentButtonContainer, StyledNewCommentInThread } from './styled-components';

interface NewCommentInThreadProps {
  threadId: string;
  isFocused: boolean;
  close: () => void;
  onFocus: () => void;
}

export const NewCommentInThread = ({ threadId, isFocused, close, onFocus }: NewCommentInThreadProps) => {
  const { data: bruker, isLoading: brukerIsLoading } = useUser();
  const { data: signature } = useGetMySignatureQuery();
  const [postReply, { isLoading }] = usePostReplyMutation();
  const oppgaveId = useOppgaveId();
  const { documentId } = useContext(SmartEditorContext);

  const [text, setText] = useState<string>('');

  if (typeof bruker === 'undefined' || brukerIsLoading || typeof signature === 'undefined' || oppgaveId === skipToken) {
    return <Loader size="xlarge" />;
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
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
    }

    if (event.key === 'Escape') {
      close();
    }
  };

  return (
    <StyledNewCommentInThread>
      <StyledTextAreaContainer isFocused={isFocused}>
        <Textarea
          value={text}
          size="small"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Svar"
          label="Nytt svar"
          minRows={3}
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
      <Button
        type="button"
        size="small"
        variant="primary"
        onClick={onSubmit}
        disabled={text.length <= 0}
        loading={isLoading}
        icon={<SuccessStroke aria-hidden />}
      >
        Legg til
      </Button>
      <Button
        type="button"
        size="small"
        variant="secondary"
        onClick={close}
        disabled={isLoading}
        icon={<Close aria-hidden />}
      >
        Avbryt
      </Button>
    </StyledCommentButtonContainer>
  );
};

const StyledTextAreaContainer = styled.div<{ isFocused: boolean }>`
  height: ${({ isFocused }) => (isFocused ? 'auto' : '0px')};
  overflow: hidden;
`;
