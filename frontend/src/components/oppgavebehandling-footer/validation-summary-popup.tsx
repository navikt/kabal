import { CollapseFilled, ExpandFilled } from '@navikt/ds-icons';
import AlertStripe from 'nav-frontend-alertstriper';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IValidationSection } from '../../functions/error-type-guard';
import { StyledButton, StyledIconButton, StyledPopup, StyledStatusText } from './styled-components';
import { ValidationSummary } from './validation-summary';

interface Props {
  sections: IValidationSection[];
  hasErrors: boolean;
}

export const ValidationSummaryPopup = ({ sections, hasErrors }: Props) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (sections.length !== 0) {
      setOpen(true);
    }
  }, [sections]);

  if (sections.length === 0) {
    return null;
  }

  const toggleOpen = () => setOpen(!open);

  const Icon = open ? CollapseFilled : ExpandFilled;

  const statusText = hasErrors ? 'Feil i utfyllingen' : 'Under utfylling';
  const statusType = hasErrors ? 'advarsel' : 'info';

  return (
    <>
      <StyledButton onClick={toggleOpen}>
        <AlertStripe type={statusType} form="inline">
          <StyledAlertStripeChildren>
            <StyledStatusText>{statusText}</StyledStatusText>
            <Icon fill="#262626" width="20px" height="20px" />
          </StyledAlertStripeChildren>
        </AlertStripe>
      </StyledButton>
      {open && (
        <StyledPopup>
          <StyledIconButton onClick={toggleOpen}>
            <Icon fill="#262626" width="20px" height="20px" />
          </StyledIconButton>
          <ValidationSummary sections={sections} />
        </StyledPopup>
      )}
    </>
  );
};

const StyledAlertStripeChildren = styled.span`
  display: flex;
  align-items: center;
`;
