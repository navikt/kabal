import { Chat2Icon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { styled } from 'styled-components';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { getIsInnsynsbegaering } from '@app/components/documents/new-documents/hooks/helpers';
import { UploadFileButton } from '@app/components/upload-file-button/upload-file-button';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { ROL_ANSWERS_TEMPLATE } from '@app/plate/templates/simple-templates';
import { useCreateSmartDocumentMutation } from '@app/redux-api/oppgaver/mutations/smart-editor';
import { useUser } from '@app/simple-api-state/use-user';
import { Role } from '@app/types/bruker';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
}

export const NewAttachmentButtons = ({ document }: Props) => {
  const isRol = useIsRol();
  const isSaksbehandler = useIsSaksbehandler();
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken || isFinished || isFeilregistrert || getIsInnsynsbegaering(document)) {
    return null;
  }

  if (!isRol && !isSaksbehandler) {
    return null;
  }

  if (isRol && !getIsRolQuestions(document)) {
    return null;
  }

  return (
    <Container>
      <NewRolAnswerDocumentButton document={document} />

      <UploadFileButton
        variant="tertiary"
        size="xsmall"
        dokumentTypeId={DistribusjonsType.NOTAT}
        parentId={document.id}
        data-testid="upload-attachment"
      >
        Last opp vedlegg
      </UploadFileButton>
    </Container>
  );
};

const NewRolAnswerDocumentButton = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data: user } = useUser();
  const isRol = useIsRol();
  const [create, { isLoading }] = useCreateSmartDocumentMutation();

  if (oppgaveId === skipToken) {
    return null;
  }

  if (!getIsRolQuestions(document) || !isRol || user === undefined) {
    return null;
  }

  const onClick = () =>
    create({
      oppgaveId,
      parentId: document.id,
      creatorIdent: user.navIdent,
      creatorRole: Role.KABAL_ROL,
      tittel: 'Svar fra rådgivende overlege',
      content: ROL_ANSWERS_TEMPLATE.content,
      dokumentTypeId: ROL_ANSWERS_TEMPLATE.dokumentTypeId,
      templateId: ROL_ANSWERS_TEMPLATE.templateId,
    });

  return (
    <Button variant="tertiary" size="xsmall" icon={<Chat2Icon aria-hidden />} onClick={onClick} loading={isLoading}>
      Opprett svardokument
    </Button>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  column-gap: 8px;
  margin-left: 24px;
`;
