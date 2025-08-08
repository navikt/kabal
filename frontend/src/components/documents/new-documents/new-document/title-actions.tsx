import { DocumentTypeEnum, type IDocument } from '@app/types/documents/documents';
import { CheckmarkIcon, PadlockLockedIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

export interface TitleActionsProps {
  document: IDocument;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
  renameAllowed: boolean;
  noRenameAccessMessage: string | null;
}

export const TitleActions = ({
  setEditMode,
  editMode,
  document,
  renameAllowed,
  noRenameAccessMessage,
}: TitleActionsProps) => {
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
      {renameAllowed ? (
        <Button
          onClick={() => setEditMode(!editMode)}
          data-testid="document-title-edit-save-button"
          size="xsmall"
          icon={<Icon aria-hidden />}
          variant="tertiary-neutral"
          title="Endre dokumentnavn"
        />
      ) : (
        <Padlock>
          {(noRenameAccessMessage ?? document.type === DocumentTypeEnum.JOURNALFOERT)
            ? 'Journalførte vedlegg må endres navn på i listen over journalførte dokumenter.'
            : null}
        </Padlock>
      )}

      {editMode ? null : (
        <Tooltip content="Kopier dokumentnavn">
          <CopyButton copyText={tittel} title="Kopier dokumentnavn" size="xsmall" />
        </Tooltip>
      )}
    </HStack>
  );
};

interface PadlockProps {
  children: string | null;
}

const Padlock = ({ children }: PadlockProps) => {
  if (children === null) {
    return <PadlockLockedIcon />;
  }

  return (
    <Tooltip content={children} maxChar={Number.POSITIVE_INFINITY}>
      <PadlockLockedIcon />
    </Tooltip>
  );
};
