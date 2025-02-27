import { StaticDataContext } from '@app/components/app/static-data-context';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { UploadFileButton } from '@app/components/upload-file-button/upload-file-button';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { ROL_ANSWERS_TEMPLATE } from '@app/plate/templates/simple-templates';
import { useCreateSmartDocumentMutation } from '@app/redux-api/collaboration';
import { Role } from '@app/types/bruker';
import { DistribusjonsType, type IMainDocument } from '@app/types/documents/documents';
import { Language } from '@app/types/texts/language';
import { Chat2Icon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';

interface Props {
  document: IMainDocument;
}

export const NewAttachmentButtons = ({ document }: Props) => {
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken || isFinished || isFeilregistrert) {
    return null;
  }

  if (
    !getIsRolQuestions(document) &&
    document.dokumentTypeId !== DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN &&
    document.dokumentTypeId !== DistribusjonsType.ANNEN_INNGAAENDE_POST
  ) {
    return null;
  }

  return (
    <HStack align="center" gap="0 2" marginInline="7 0">
      <NewRolAnswerDocumentButton document={document} />

      <UploadFileButton
        variant="tertiary"
        size="xsmall"
        dokumentTypeId={document.dokumentTypeId}
        parentId={document.id}
        data-testid="upload-attachment"
      >
        Last opp vedlegg
      </UploadFileButton>
    </HStack>
  );
};

const NewRolAnswerDocumentButton = ({ document }: Props) => {
  const { data: oppgave } = useOppgave();
  const { user } = useContext(StaticDataContext);
  const isRol = useIsRol();
  const [create, { isLoading }] = useCreateSmartDocumentMutation();

  if (oppgave === undefined) {
    return null;
  }

  if (!(getIsRolQuestions(document) && isRol)) {
    return null;
  }

  const onClick = () =>
    create({
      oppgaveId: oppgave.id,
      parentId: document.id,
      creatorIdent: user.navIdent,
      creatorRole: Role.KABAL_ROL,
      tittel: 'Svar fra rådgivende overlege',
      content: ROL_ANSWERS_TEMPLATE.richText,
      dokumentTypeId: ROL_ANSWERS_TEMPLATE.dokumentTypeId,
      templateId: ROL_ANSWERS_TEMPLATE.templateId,
      language: Language.NB,
    });

  return (
    <Button variant="tertiary" size="xsmall" icon={<Chat2Icon aria-hidden />} onClick={onClick} loading={isLoading}>
      Opprett svardokument
    </Button>
  );
};
