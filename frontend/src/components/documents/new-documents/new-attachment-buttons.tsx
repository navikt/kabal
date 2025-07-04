import { UploadFileButton } from '@app/components/upload-file-button/upload-file-button';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useCreatorRole } from '@app/hooks/dua-access/use-creator-role';
import { useDuaAccess } from '@app/hooks/dua-access/use-dua-access';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasUploadAccess } from '@app/hooks/use-has-documents-access';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { ROL_ANSWERS_TEMPLATE } from '@app/plate/templates/simple-templates';
import { useCreateSmartDocumentMutation } from '@app/redux-api/collaboration';
import { DocumentTypeEnum, type IParentDocument } from '@app/types/documents/documents';
import { Language } from '@app/types/texts/language';
import { Chat2Icon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';

interface Props {
  document: IParentDocument;
}

export const NewAttachmentButtons = (props: Props) => {
  const isFeilregistrert = useIsFeilregistrert();

  if (isFeilregistrert) {
    return null;
  }

  return (
    <HStack align="center" gap="0 2" marginInline="9 0" className="empty:hidden">
      <NewRolAnswerDocumentButton {...props} />
      <Upload {...props} />
    </HStack>
  );
};

const Upload = ({ document }: Props) => {
  const canUpload = useHasUploadAccess();
  const creatorRole = useCreatorRole();
  const createAccess = useDuaAccess(
    { isSmartDokument: false, creator: { creatorRole }, type: DocumentTypeEnum.UPLOADED, parentId: document.id },
    DuaActionEnum.CREATE,
    document,
  );

  if (!canUpload || createAccess !== null) {
    return null;
  }

  return (
    <UploadFileButton
      variant="tertiary-neutral"
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
  const [create, { isLoading }] = useCreateSmartDocumentMutation();

  const creatorRole = useCreatorRole();

  const createAccess = useDuaAccess(
    {
      isSmartDokument: true,
      templateId: ROL_ANSWERS_TEMPLATE.templateId,
      type: DocumentTypeEnum.SMART,
      creator: { creatorRole },
      parentId: document.id,
    },
    DuaActionEnum.CREATE,
    document,
  );

  if (!isSuccess || createAccess !== null) {
    return null;
  }

  const onClick = () =>
    create({
      oppgaveId: oppgave.id,
      parentId: document.id,
      tittel: 'Svar fra rådgivende overlege',
      content: ROL_ANSWERS_TEMPLATE.richText,
      dokumentTypeId: ROL_ANSWERS_TEMPLATE.dokumentTypeId,
      templateId: ROL_ANSWERS_TEMPLATE.templateId,
      language: Language.NB,
    });

  return (
    <Button
      variant="tertiary-neutral"
      size="xsmall"
      icon={<Chat2Icon aria-hidden />}
      onClick={onClick}
      loading={isLoading}
    >
      <span className="font-normal">Opprett svardokument</span>
    </Button>
  );
};
