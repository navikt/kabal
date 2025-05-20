import { StaticDataContext } from '@app/components/app/static-data-context';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { UploadFileButton } from '@app/components/upload-file-button/upload-file-button';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasUploadAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsAssignedRolAndSent } from '@app/hooks/use-is-rol';
import { ROL_ANSWERS_TEMPLATE } from '@app/plate/templates/simple-templates';
import { useCreateSmartDocumentMutation } from '@app/redux-api/collaboration';
import { Role } from '@app/types/bruker';
import { DocumentTypeEnum, type IParentDocument } from '@app/types/documents/documents';
import { Language } from '@app/types/texts/language';
import { Chat2Icon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useContext } from 'react';

interface Props {
  document: IParentDocument;
}

export const NewAttachmentButtons = (props: Props) => {
  const isFeilregistrert = useIsFeilregistrert();

  if (isFeilregistrert) {
    return null;
  }

  return (
    <HStack align="center" gap="0 2" marginInline="7 0" className="empty:hidden">
      <NewRolAnswerDocumentButton {...props} />
      <Upload {...props} />
    </HStack>
  );
};

const Upload = ({ document }: Props) => {
  const canUpload = useHasUploadAccess();

  if (!canUpload || document.isSmartDokument || document.type !== DocumentTypeEnum.UPLOADED) {
    return null;
  }

  return (
    <UploadFileButton
      variant="tertiary"
      size="xsmall"
      distributionType={document.dokumentTypeId}
      parentId={document.id}
      data-testid="upload-attachment"
    >
      Last opp vedlegg
    </UploadFileButton>
  );
};

const NewRolAnswerDocumentButton = ({ document }: Props) => {
  const { data: oppgave, isSuccess } = useOppgave();
  const { user } = useContext(StaticDataContext);
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const isRol = useIsAssignedRolAndSent();
  const [create, { isLoading }] = useCreateSmartDocumentMutation();

  if (!isSuccess || isFeilregistrert || isFinished || !isRol || !getIsRolQuestions(document)) {
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
