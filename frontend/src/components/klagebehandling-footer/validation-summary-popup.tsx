import AlertStripe from 'nav-frontend-alertstriper';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IValidationSection } from '../../functions/error-type-guard';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { ArrowDown } from '../../icons/arrow-down';
import { ArrowUp } from '../../icons/arrow-up';
import { KlagebehandlingFinished } from './klagebehandling-finished';
import { ValidationSummary } from './validation-summary';

interface Props {
  sections: IValidationSection[];
  hasErrors: boolean;
}

export const ValidationSummaryPopup = ({ sections, hasErrors }: Props) => {
  const [open, setOpen] = useState(true);
  const klagebehandlingId = useKlagebehandlingId();
  const isFullfoert = useIsFullfoert(klagebehandlingId);

  useEffect(() => {
    if (sections.length !== 0) {
      setOpen(true);
    }
  }, [sections]);

  if (isFullfoert) {
    return <KlagebehandlingFinished />;
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

const StyledPopup = styled.div`
  position: absolute;
  bottom: 4em;
  right: 1em;
  width: 400px;
`;

const StyledButton = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
`;

const StyledStatusText = styled.span`
  margin-right: 1em;
`;

const StyledIconButton = styled(StyledButton)`
  position: absolute;
  right: 0;
  padding: 1em;
`;
