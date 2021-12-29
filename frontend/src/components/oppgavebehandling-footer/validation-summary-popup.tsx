import AlertStripe from 'nav-frontend-alertstriper';
import React, { useEffect, useState } from 'react';
import { IValidationSection } from '../../functions/error-type-guard';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { ArrowDown } from '../../icons/arrow-down';
import { ArrowUp } from '../../icons/arrow-up';
import { OppgavebehandlingFinished } from './oppgavebehandling-finished';
import { StyledButton, StyledIconButton, StyledPopup, StyledStatusText } from './styled-components';
import { ValidationSummary } from './validation-summary';

interface Props {
  sections: IValidationSection[];
  hasErrors: boolean;
}

export const ValidationSummaryPopup = ({ sections, hasErrors }: Props) => {
  const [open, setOpen] = useState(true);
  const isFullfoert = useIsFullfoert();

  useEffect(() => {
    if (sections.length !== 0) {
      setOpen(true);
    }
  }, [sections]);

  if (isFullfoert) {
    return <OppgavebehandlingFinished />;
  }

  if (sections.length === 0) {
    return null;
  }

  const toggleOpen = () => setOpen(!open);

  const icon = open ? <ArrowDown fill="#262626" /> : <ArrowUp fill="#262626" />;

  const statusText = hasErrors ? 'Feil i utfyllingen' : 'Under utfylling';
  const statusType = hasErrors ? 'advarsel' : 'info';

  return (
    <>
      <StyledButton onClick={toggleOpen}>
        <AlertStripe type={statusType} form="inline">
          <StyledStatusText>{statusText}</StyledStatusText>
          {icon}
        </AlertStripe>
      </StyledButton>
      {open && (
        <StyledPopup>
          <StyledIconButton onClick={toggleOpen}>{icon}</StyledIconButton>
          <ValidationSummary sections={sections} />
        </StyledPopup>
      )}
    </>
  );
};
