import { PaperplaneIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useState } from 'react';

interface ConfirmProps extends React.RefAttributes<HTMLDivElement> {
  onFinish: () => void;
  onValidate: () => Promise<boolean>;
  isFinishing: boolean;
  isValidating: boolean;
  actionText: string;
  disabled?: boolean;
}

export const Confirm = ({
  onFinish,
  onValidate,
  actionText,
  isValidating,
  isFinishing,
  disabled = false,
  ...rest
}: ConfirmProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showConfirm) {
    return (
      <HStack justify="start" gap="space-0 space-16" {...rest}>
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
          disabled={disabled}
        >
          {actionText}
        </Button>
      </HStack>
    );
  }

  return (
    <HStack justify="start" gap="space-0 space-16" {...rest}>
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
        data-color="neutral"
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
    </HStack>
  );
};
