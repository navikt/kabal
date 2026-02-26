import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton, HStack } from '@navikt/ds-react';

interface ConfirmProps {
  setEditMode: (editMode: boolean) => void;
}

interface Props extends ConfirmProps {
  hasAccess: boolean;
  tittel: string;
}

export const ConfirmEditButton = ({ setEditMode }: ConfirmProps) => (
  <Button
    data-color="neutral"
    onClick={() => setEditMode(false)}
    icon={<CheckmarkIcon aria-hidden className="text-ax-large" />}
    data-testid="document-title-edit-save-button"
    title="Endre"
    size="xsmall"
    variant="tertiary"
    tabIndex={-1}
  />
);

export const DocumentTitleActions = ({ setEditMode, hasAccess, tittel }: Props) => {
  if (!hasAccess) {
    return null;
  }

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
        data-color="neutral"
        onClick={() => setEditMode(true)}
        icon={<PencilIcon aria-hidden className="text-ax-large" />}
        data-testid="document-title-edit-save-button"
        title="Endre"
        size="xsmall"
        variant="tertiary"
        tabIndex={-1}
      />
      <CopyButton copyText={tittel} title="Kopier dokumentnavn" size="xsmall" tabIndex={-1} />
    </HStack>
  );
};
