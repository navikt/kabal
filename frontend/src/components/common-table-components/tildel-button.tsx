import React, { useCallback, useRef, useState } from 'react';
import { useAvailableEnheterForYtelse } from '../../hooks/use-available-enheter-for-ytelse';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { useTildelSaksbehandlerMutation } from '../../redux-api/ansatte';
import { IEnhet, useGetBrukerQuery } from '../../redux-api/bruker';
import {
  Dropdown,
  DropdownContainer,
  DropdownOption,
  StyledButton,
  SuccessStatus,
  TildelDropdownButton,
} from './styled-components';

interface Props {
  klagebehandlingId: string;
  ytelse: string;
}

export const TildelKlagebehandlingButton = ({ klagebehandlingId, ytelse }: Props) => {
  const [tildelSaksbehandler, result] = useTildelSaksbehandlerMutation();
  const { data: userData, isLoading: isUserLoading } = useGetBrukerQuery();
  const enheter = useAvailableEnheterForYtelse(ytelse);

  const onTildel = useCallback(
    (enhetId: string) => {
      if (typeof userData === 'undefined') {
        return;
      }

      tildelSaksbehandler({
        oppgaveId: klagebehandlingId,
        navIdent: userData.navIdent,
        enhetId,
      });
    },
    [klagebehandlingId, userData, tildelSaksbehandler]
  );

  const hasAccess = enheter.length !== 0;

  if (!hasAccess || typeof userData === 'undefined') {
    return null;
  }

  if (result.isSuccess) {
    return (
      <SuccessStatus data-testid="oppgave-tildel-success" data-oppgaveid={klagebehandlingId}>
        Tildelt!
      </SuccessStatus>
    );
  }

  if (isUserLoading) {
    return (
      <StyledButton disabled autoDisableVedSpinner spinner>
        Tildel meg
      </StyledButton>
    );
  }

  if (enheter.length === 1) {
    return (
      <TildelEnhetButton
        enhet={enheter[0]}
        oppgaveId={klagebehandlingId}
        isLoading={result.isLoading}
        onTildel={onTildel}
      >
        {getTildelText(result.isLoading)}
      </TildelEnhetButton>
    );
  }

  const tildelButtons = enheter.map((enhet) => (
    <li key={enhet.id}>
      <TildelEnhetDropdownButton
        enhet={enhet}
        oppgaveId={klagebehandlingId}
        isLoading={result.isLoading}
        onTildel={onTildel}
      >
        {enhet.navn}
      </TildelEnhetDropdownButton>
    </li>
  ));

  return <TildelDropdown isLoading={result.isLoading}>{tildelButtons}</TildelDropdown>;
};

interface DropdownButtonProps {
  isLoading: boolean;
  children: ReturnType<typeof TildelEnhetButton>[];
}

const TildelDropdown = ({ children, isLoading }: DropdownButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(() => setIsOpen(false), ref);

  if (!isOpen || isLoading) {
    return (
      <DropdownContainer ref={ref}>
        <TildelDropdownButton
          className="knapp"
          onClick={() => setIsOpen(!isOpen)}
          open={isOpen}
          title="Trykk for å velge enhet å tildele under."
        >
          {getTildelText(isLoading)}
        </TildelDropdownButton>
      </DropdownContainer>
    );
  }

  return (
    <DropdownContainer ref={ref}>
      <TildelDropdownButton
        className="knapp"
        onClick={() => setIsOpen(!isOpen)}
        open={isOpen}
        title="Trykk for å velge enhet å tildele under."
      >
        {getTildelText(isLoading)}
      </TildelDropdownButton>
      <Dropdown>{children}</Dropdown>
    </DropdownContainer>
  );
};

interface TildelEnhetButtonProps {
  oppgaveId: string;
  enhet: IEnhet;
  isLoading: boolean;
  children: string;
  onTildel: (enhetId: string) => void;
}

const TildelEnhetButton = ({ oppgaveId, enhet, children, isLoading, onTildel }: TildelEnhetButtonProps) => (
  <StyledButton
    onClick={() => onTildel(enhet.id)}
    spinner={isLoading}
    disabled={isLoading}
    autoDisableVedSpinner
    data-testid="klagebehandling-tildel-button"
    data-klagebehandlingid={oppgaveId}
    title={`Tildel meg under ${enhet.navn}.`}
  >
    {children}
  </StyledButton>
);

const TildelEnhetDropdownButton = ({ oppgaveId, enhet, children, isLoading, onTildel }: TildelEnhetButtonProps) => (
  <DropdownOption
    onClick={() => onTildel(enhet.id)}
    disabled={isLoading}
    data-testid="klagebehandling-tildel-dropdown-button"
    data-klagebehandlingid={oppgaveId}
    title={`Tildel meg under ${enhet.navn}.`}
  >
    {children}
  </DropdownOption>
);

const getTildelText = (loading: boolean): string => (loading ? 'Tildeler ...' : 'Tildel meg');
