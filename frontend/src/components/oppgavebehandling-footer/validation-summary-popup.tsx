import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { ValidationErrorContext } from '@app/components/kvalitetsvurdering/validation-error-context';
import { StyledButton, StyledIconButton, StyledPopup } from './styled-components';
import { ValidationSummary } from './validation-summary';

export const ValidationSummaryPopup = () => {
  const { validationSectionErrors } = useContext(ValidationErrorContext);
  const [open, setOpen] = useState(true);
  const toggleOpen = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    if (validationSectionErrors.length !== 0) {
      setOpen(true);
    }
  }, [validationSectionErrors]);

  if (validationSectionErrors.length === 0) {
    return null;
  }

  const Icon = open ? ChevronUpIcon : ChevronDownIcon;

  const hasErrors = validationSectionErrors.length !== 0;

  const statusText = hasErrors ? 'Feil i utfyllingen' : 'Under utfylling';
  const statusType = hasErrors ? 'warning' : 'info';

  return (
    <>
      <StyledButton onClick={toggleOpen}>
        <Alert variant={statusType} size="small" inline>
          <StyledAlertStripeChildren>
            <span>{statusText}</span>
            <Icon fill="#262626" />
          </StyledAlertStripeChildren>
        </Alert>
      </StyledButton>
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

  if (!open || !hasErrors) {
    return null;
  }

  return (
    <StyledPopup>
      <StyledIconButton onClick={() => setOpen(false)}>
        <ChevronUpIcon fill="#262626" />
      </StyledIconButton>
      <ValidationSummary sections={validationSectionErrors} />
    </StyledPopup>
  );
};

const StyledAlertStripeChildren = styled.div`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-3);
`;
