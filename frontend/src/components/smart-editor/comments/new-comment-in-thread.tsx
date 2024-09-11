import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { usePostReplyMutation } from '@app/redux-api/smart-editor-comments';
import { StyledNewReply } from './styled-components';
import { WriteComment } from './write-comment/write-comment';

interface NewCommentInThreadProps {
  threadId: string;
  isExpanded: boolean;
  close?: () => void;
}

export const NewCommentInThread = ({ threadId, isExpanded, close }: NewCommentInThreadProps) => {
  const { user } = useContext(StaticDataContext);
  const { data: signature } = useGetMySignatureQuery();
  const [postReply, { isLoading }] = usePostReplyMutation();
  const oppgaveId = useOppgaveId();
  const { dokumentId } = useContext(SmartEditorContext);

  if (!isExpanded) {
    return null;
  }

  if (typeof signature === 'undefined' || oppgaveId === skipToken) {
    return <Loader size="xlarge" />;
  }

  const onSubmit = async (text: string): Promise<void> => {
    await postReply({
      oppgaveId,
      author: {
        ident: user.navIdent,
        name: signature?.customLongName ?? signature.longName,
      },
      dokumentId,
      text,
      commentId: threadId,
    });
  };

  return (
    <StyledNewReply>
      <WriteComment
        onSubmit={onSubmit}
        isLoading={isLoading}
        label="Svar på kommentar"
        close={close}
        primaryButtonLabel="Legg til"
      />
    </StyledNewReply>
  );
};
