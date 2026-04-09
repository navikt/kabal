import { CheckmarkIcon, PadlockLockedIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, HStack, Tooltip } from '@navikt/ds-react';
import type { IDocument } from '@/types/documents/documents';

export interface TitleActionsProps {
  document: IDocument;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
  renameAccessError: string | null;
}

export const TitleActions = ({ setEditMode, editMode, document, renameAccessError }: TitleActionsProps) => {
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
      {renameAccessError === null ? (
        <Button
          data-color="neutral"
          onClick={() => setEditMode(!editMode)}
          size="xsmall"
          icon={<Icon aria-hidden />}
          variant="tertiary"
          title="Endre dokumentnavn"
        />
      ) : (
        <Padlock>{renameAccessError}</Padlock>
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
