import { PaperplaneIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { StyledButtons } from './styled-components';

interface ConfirmProps {
  onClick: () => void;
  isFinishing: boolean;
  isValidating: boolean;
  actionText: string;
}

export const Confirm = ({ onClick, actionText, isValidating, isFinishing }: ConfirmProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showConfirm) {
    return (
      <StyledButtons>
        <Button
          type="button"
          size="small"
          variant="primary"
          onClick={() => setShowConfirm(true)}
          loading={isFinishing || isValidating}
          data-testid="document-finish-button"
          icon={<PaperplaneIcon aria-hidden />}
        >
          {actionText}
        </Button>
      </StyledButtons>
    );
  }

  return (
    <StyledButtons>
      <Button
        type="button"
        size="small"
        variant="secondary"
        onClick={() => setShowConfirm(false)}
        data-testid="document-finish-cancel"
        disabled={isFinishing || isValidating}
        icon={<XMarkIcon aria-hidden />}
      >
        Avbryt
      </Button>
      <Button
        type="button"
        size="small"
        variant="primary"
        onClick={onClick}
        loading={isFinishing || isValidating}
        data-testid="document-finish-confirm"
        icon={<PaperplaneIcon aria-hidden />}
      >
        {actionText}
      </Button>
    </StyledButtons>
  );
};
