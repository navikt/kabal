import type { IDocument } from '@app/types/documents/documents';
import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, HStack } from '@navikt/ds-react';

interface Props {
  document: IDocument;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
  renameAccess: boolean;
}

export const TitleActions = ({ setEditMode, editMode, document, renameAccess }: Props) => {
  const { tittel } = document;
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
      {renameAccess ? (
        <Button
          onClick={() => setEditMode(!editMode)}
          data-testid="document-title-edit-save-button"
          size="xsmall"
          icon={<Icon aria-hidden />}
          variant="tertiary"
          title="Endre dokumentnavn"
        />
      ) : null}
      {editMode ? null : <CopyButton copyText={tittel} title="Kopier dokumentnavn" size="xsmall" />}
    </HStack>
  );
};
