import { CollapseFilled, ExpandFilled } from '@navikt/ds-icons';
import { Alert } from '@navikt/ds-react';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { IValidationSection } from '../../functions/error-type-guard';
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

  const Icon = open ? CollapseFilled : ExpandFilled;

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
      <Popup hasErrors={hasErrors} sections={sections} setOpen={setOpen} />
    </>
  );
};

interface PopupProps extends Props {
  setOpen: (open: boolean) => void;
}

const Popup = ({ hasErrors, sections, setOpen }: PopupProps) => {
  if (!hasErrors) {
    return null;
  }

  return (
    <StyledPopup>
      <StyledIconButton onClick={() => setOpen(false)}>
        <CollapseFilled fill="#262626" />
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
