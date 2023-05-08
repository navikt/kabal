import { ErrorMessage, Loader, Select } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useOppgaveActions } from '@app/hooks/use-oppgave-actions';
import { useGetPotentialSaksbehandlereQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { useUser } from '@app/simple-api-state/use-user';
import { IOppgave } from '@app/types/oppgaver';
import { useTildel } from './use-tildel';

const NOT_SELECTED = 'NOT_SELECTED';

export const Saksbehandler = (oppgave: IOppgave) => {
  const { data: user, isLoading: userIsLoading, isError: userIsError } = useUser();
  const [access, isLoading] = useOppgaveActions(oppgave.ytelse, oppgave.tildeltSaksbehandlerident);

  if (userIsError) {
    return (
      <Container>
        <StyledErrorMessage>Feil ved lasting</StyledErrorMessage>
      </Container>
    );
  }

  if (userIsLoading || isLoading || typeof user === 'undefined') {
    return (
      <Container>
        <Loader size="small" />
      </Container>
    );
  }

  if (access.assignOthers) {
    return (
      <Container>
        <SelectSaksbehandler {...oppgave} />
      </Container>
    );
  }

  if (oppgave.tildeltSaksbehandlerident === null) {
    return (
      <Container>
        <StyledSaksbehandler>Ikke tildelt</StyledSaksbehandler>
      </Container>
    );
  }

  const saksbehandler = `${oppgave.tildeltSaksbehandlerNavn ?? 'Laster...'} (${oppgave.tildeltSaksbehandlerident})`;

  return (
    <Container>
      <StyledSaksbehandler title={saksbehandler}>{saksbehandler}</StyledSaksbehandler>
    </Container>
  );
};

const SelectSaksbehandler = ({ id, type, ytelse, tildeltSaksbehandlerident, tildeltSaksbehandlerNavn }: IOppgave) => {
  const {
    data,
    isLoading: potentialSaksbehandlereIsLoading,
    isError: saksbehandlereIsError,
  } = useGetPotentialSaksbehandlereQuery(id);
  const [tildel, { isLoading }] = useTildel(id, type, ytelse);

  if (saksbehandlereIsError) {
    return <StyledErrorMessage>Feil ved lasting</StyledErrorMessage>;
  }

  if (potentialSaksbehandlereIsLoading || typeof data === 'undefined') {
    return <Loader size="small" />;
  }

  const options = data.saksbehandlere.map(({ navIdent, navn }) => (
    <option key={navIdent} value={navIdent}>
      {navn} ({navIdent})
    </option>
  ));

  const onChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => tildel(target.value);

  const saksbehandler =
    tildeltSaksbehandlerident === null
      ? undefined
      : `${tildeltSaksbehandlerNavn ?? 'Laster...'} (${tildeltSaksbehandlerident})`;

  return (
    <StyledSelect
      label="Velg saksbehandler"
      hideLabel
      size="small"
      value={tildeltSaksbehandlerident ?? NOT_SELECTED}
      onChange={onChange}
      disabled={isLoading}
      title={saksbehandler}
    >
      {tildeltSaksbehandlerident === null ? <option value={NOT_SELECTED}>Ikke tildelt</option> : null}
      {options}
    </StyledSelect>
  );
};

const Container = styled.div`
  grid-area: saksbehandler;
  vertical-align: middle;
  display: flex;
  align-items: center;
  justify-content: left;
  height: 34px;
`;

const StyledSelect = styled(Select)`
  width: 100%;
`;

const StyledSaksbehandler = styled.span`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0.25rem;
  border: 1px solid var(--a-border-divider);
  border-radius: var(--a-border-radius-medium);
  background-color: white;
`;

const StyledErrorMessage = styled(ErrorMessage)`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;
