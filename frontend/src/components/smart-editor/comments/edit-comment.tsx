import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface EditButtonProps {
  isEditing: boolean;
  setIsEditing: () => void;
}

export const EditButton = ({ isEditing, setIsEditing }: EditButtonProps) => (
  <Button
    size="xsmall"
    icon={isEditing ? <CheckmarkIcon aria-hidden /> : <PencilIcon aria-hidden />}
    variant="tertiary-neutral"
    onClick={setIsEditing}
    title={isEditing ? 'Lagre' : 'Rediger kommentar'}
  />
);
