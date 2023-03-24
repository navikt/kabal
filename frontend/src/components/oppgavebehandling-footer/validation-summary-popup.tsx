import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IValidationSection } from '@app/functions/error-type-guard';
import { StyledButton, StyledIconButton, StyledPopup } from './styled-components';
import { ValidationSummary } from './validation-summary';

interface Props {
  sections: IValidationSection[];
  hasErrors: boolean;
}

export const ValidationSummaryPopup = ({ sections, hasErrors }: Props) => {
  const [open, setOpen] = useState(true);
  const toggleOpen = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    if (sections.length !== 0) {
      setOpen(true);
    }
  }, [sections]);

  if (sections.length === 0) {
    return null;
  }

  const Icon = open ? ChevronUpIcon : ChevronDownIcon;

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
      <Popup hasErrors={hasErrors} sections={sections} setOpen={setOpen} open={open} />
    </>
  );
};

interface PopupProps extends Props {
  setOpen: (open: boolean) => void;
  open: boolean;
}

const Popup = ({ hasErrors, sections, open, setOpen }: PopupProps) => {
  if (!open || !hasErrors) {
    return null;
  }

  return (
    <StyledPopup>
      <StyledIconButton onClick={() => setOpen(false)}>
        <ChevronUpIcon fill="#262626" />
      </StyledIconButton>
      <ValidationSummary sections={sections} />
    </StyledPopup>
  );
};

const StyledAlertStripeChildren = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
