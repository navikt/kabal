import { UploadFileButton } from '@app/components/upload-file-button/upload-file-button';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useCreatorRole } from '@app/hooks/dua-access/use-creator-role';
import { useDuaAccess } from '@app/hooks/dua-access/use-dua-access';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSmartEditorActiveDocument } from '@app/hooks/settings/use-setting';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { ROL_ANSWERS_TEMPLATE } from '@app/plate/templates/simple-templates';
import { useCreateSmartDocumentMutation } from '@app/redux-api/collaboration';
import { DocumentTypeEnum, type IParentDocument } from '@app/types/documents/documents';
import { Language } from '@app/types/texts/language';
import { Chat2Icon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

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
  const creatorRole = useCreatorRole();
  const uploadAccessError = useDuaAccess(
    { creator: { creatorRole }, type: DocumentTypeEnum.UPLOADED },
    DuaActionEnum.CREATE,
    document,
  );

  if (uploadAccessError !== null) {
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
  const oppgaveId = useOppgaveId();
  const [create, { isLoading }] = useCreateSmartDocumentMutation();
  const creatorRole = useCreatorRole();
  const createAccessError = useDuaAccess(
    {
      templateId: ROL_ANSWERS_TEMPLATE.templateId,
      type: DocumentTypeEnum.SMART,
      creator: { creatorRole },
    },
    DuaActionEnum.CREATE,
    document,
  );
  const { setValue: setActiveDocument } = useSmartEditorActiveDocument();

  if (oppgaveId === skipToken || createAccessError !== null) {
    return null;
  }

  const onClick = async () => {
    const { id } = await create({
      oppgaveId: oppgaveId,
      parentId: document.id,
      tittel: 'Svar fra rådgivende overlege',
      content: ROL_ANSWERS_TEMPLATE.richText,
      dokumentTypeId: ROL_ANSWERS_TEMPLATE.dokumentTypeId,
      templateId: ROL_ANSWERS_TEMPLATE.templateId,
      language: Language.NB,
    }).unwrap();

    setActiveDocument(id);
  };
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
