import { Chat2Icon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { UploadFileButton } from '@/components/upload-file-button/upload-file-button';
import { DuaActionEnum } from '@/hooks/dua-access/access';
import { useCreatorRole } from '@/hooks/dua-access/use-creator-role';
import { useDuaAccess } from '@/hooks/dua-access/use-dua-access';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useSmartEditorActiveDocument } from '@/hooks/settings/use-setting';
import { useIsFeilregistrert } from '@/hooks/use-is-feilregistrert';
import { ROL_ANSWERS_TEMPLATE } from '@/plate/templates/simple-templates';
import { useCreateSmartDocumentMutation } from '@/redux-api/collaboration';
import { DocumentTypeEnum, type IParentDocument } from '@/types/documents/documents';
import { Language } from '@/types/texts/language';

interface Props {
  document: IParentDocument;
}

export const NewAttachmentButtons = (props: Props) => {
  const isFeilregistrert = useIsFeilregistrert();

  if (isFeilregistrert) {
    return null;
  }

  return (
    <HStack align="center" gap="space-0 space-8" marginInline="space-36 space-0" className="empty:hidden">
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
      data-color="neutral"
      variant="tertiary"
      size="xsmall"
      icon={<Chat2Icon aria-hidden />}
      onClick={onClick}
      loading={isLoading}
    >
      <span className="font-normal">Opprett svardokument</span>
    </Button>
  );
};
