import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface EditButtonProps {
  isEditing: boolean;
  setIsEditing: () => void;
  className?: string;
}

export const EditButton = ({ isEditing, setIsEditing, className }: EditButtonProps) => (
  <Button
    data-color="neutral"
    size="xsmall"
    icon={isEditing ? <CheckmarkIcon aria-hidden /> : <PencilIcon aria-hidden />}
    variant="tertiary"
    onClick={setIsEditing}
    className={className}
    title={isEditing ? 'Lagre' : 'Rediger kommentar'}
  />
);
