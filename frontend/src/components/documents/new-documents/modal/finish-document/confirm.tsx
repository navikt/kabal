import { PaperplaneIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import { StyledButtons } from './styled-components';

interface ConfirmProps {
  onFinish: () => void;
  onValidate: () => Promise<boolean>;
  isFinishing: boolean;
  isValidating: boolean;
  actionText: string;
}

export const Confirm = ({ onFinish, onValidate, actionText, isValidating, isFinishing }: ConfirmProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showConfirm) {
    return (
      <StyledButtons>
        <Button
          type="button"
          size="small"
          variant="primary"
          onClick={async () => {
            const isValid = await onValidate();
            setShowConfirm(isValid);
          }}
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
        variant="primary"
        onClick={onFinish}
        loading={isFinishing || isValidating}
        data-testid="document-finish-confirm"
        icon={<PaperplaneIcon aria-hidden />}
      >
        {actionText}
      </Button>
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
    </StyledButtons>
  );
};
