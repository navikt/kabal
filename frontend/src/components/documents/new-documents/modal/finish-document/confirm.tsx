import { PaperplaneIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useState } from 'react';
import { AccessErrorsSummary } from '@/components/documents/new-documents/modal/access-errors-summary';

interface ConfirmProps extends React.RefAttributes<HTMLDivElement> {
  onFinish: () => void;
  onValidate: () => Promise<boolean>;
  isFinishing: boolean;
  isValidating: boolean;
  actionText: string;
  accessError?: string | null;
}

export const Confirm = ({
  onFinish,
  onValidate,
  actionText,
  isValidating,
  isFinishing,
  accessError = null,
  ...rest
}: ConfirmProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showConfirm) {
    return (
      <AccessErrorsSummary documentErrors={accessError === null ? [] : [accessError]}>
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
            disabled={accessError !== null}
            icon={<PaperplaneIcon aria-hidden />}
          >
            {actionText}
          </Button>
        </HStack>
      </AccessErrorsSummary>
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
        disabled={isFinishing || isValidating}
        icon={<XMarkIcon aria-hidden />}
      >
        Avbryt
      </Button>
    </HStack>
  );
};
