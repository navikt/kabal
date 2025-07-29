import { ValidationErrorContext } from '@app/components/kvalitetsvurdering/validation-error-context';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Alert, BoxNew, Button, HStack } from '@navikt/ds-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ValidationSummary } from './validation-summary';

export const ValidationSummaryPopup = () => {
  const { validationSectionErrors } = useContext(ValidationErrorContext);
  const [open, setOpen] = useState(true);
  const toggleOpen = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    if (validationSectionErrors.length > 0) {
      setOpen(true);
    }
  }, [validationSectionErrors]);

  if (validationSectionErrors.length === 0) {
    return null;
  }

  const Icon = open ? ChevronDownIcon : ChevronUpIcon;

  const hasErrors = validationSectionErrors.length > 0;

  const statusText = hasErrors ? 'Feil i utfyllingen' : 'Under utfylling';
  const statusType = hasErrors ? 'warning' : 'info';

  return (
    <>
      <Button variant="tertiary-neutral" size="small" icon={<Icon />} onClick={toggleOpen}>
        <Alert variant={statusType} size="small" inline>
          <HStack align="center" gap="2">
            <span>{statusText}</span>
          </HStack>
        </Alert>
      </Button>
      <Popup hasErrors={hasErrors} setOpen={setOpen} open={open} />
    </>
  );
};

interface PopupProps {
  setOpen: (open: boolean) => void;
  open: boolean;
  hasErrors: boolean;
}

const Popup = ({ open, setOpen, hasErrors }: PopupProps) => {
  const { validationSectionErrors } = useContext(ValidationErrorContext);

  if (!(open && hasErrors)) {
    return null;
  }

  return (
    <BoxNew position="absolute" right="0" marginBlock="0 1" marginInline="0 1" maxWidth="500px" className="bottom-full">
      <Button
        variant="tertiary-neutral"
        size="small"
        type="button"
        onClick={() => setOpen(false)}
        className="absolute top-3 right-3 cursor-pointer"
        icon={<ChevronDownIcon />}
      />

      <ValidationSummary sections={validationSectionErrors} />
    </BoxNew>
  );
};
