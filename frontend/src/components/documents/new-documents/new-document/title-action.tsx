import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, HStack } from '@navikt/ds-react';

interface Props {
  document: IMainDocument;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
}

export const TitleAction = ({ setEditMode, editMode, document }: Props) => {
  const canEdit = useCanEditDocument(document);
  const canRename = canEdit && document.type !== DocumentTypeEnum.JOURNALFOERT;

  const { tittel } = document;

  if (!canRename) {
    return (
      <CopyButton
        copyText={tittel}
        title="Kopier dokumentnavn"
        size="xsmall"
        className="w-0 shrink-0 overflow-hidden focus-within:w-fit group-hover:w-fit"
      />
    );
  }

  const Icon = editMode ? CheckmarkIcon : PencilIcon;

  return (
    <HStack
      align="center"
      wrap={false}
      flexShrink="0"
      width="0"
      overflow="hidden"
      className="focus-within:w-fit group-hover:w-fit"
    >
      <Button
        onClick={() => setEditMode(!editMode)}
        data-testid="document-title-edit-save-button"
        size="xsmall"
        icon={<Icon aria-hidden />}
        variant="tertiary"
        title="Endre dokumentnavn"
      />
      {editMode ? null : <CopyButton copyText={tittel} title="Kopier dokumentnavn" size="xsmall" />}
    </HStack>
  );
};
