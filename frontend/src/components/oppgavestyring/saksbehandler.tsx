import { ErrorMessage, Select } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import styled from 'styled-components';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { useOppgaveActions } from '@app/hooks/use-oppgave-actions';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { useGetPotentialSaksbehandlereQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { useUser } from '@app/simple-api-state/use-user';
import { IOppgave } from '@app/types/oppgaver';
import { useTildel } from './use-tildel';

const NOT_SELECTED = 'NOT_SELECTED';

export const Saksbehandler = (oppgave: IOppgave) => {
  const { data: user, isLoading: userIsLoading, isError: userIsError } = useUser();
  const [access, isLoading] = useOppgaveActions(
    oppgave.tildeltSaksbehandlerident,
    oppgave.medunderskriverident !== null,
    oppgave.ytelse
  );
  const { data: signature, isLoading: signatureIsLoading } = useGetSignatureQuery(
    oppgave.tildeltSaksbehandlerident ?? skipToken
  );

  if (userIsError) {
    return (
      <Container>
        <StyledErrorMessage>Feil ved lasting</StyledErrorMessage>
      </Container>
    );
  }

  if (userIsLoading || signatureIsLoading || isLoading || user === undefined) {
    return (
      <Container>
        <LoadingCellContent />
      </Container>
    );
  }

  const name = signature?.customLongName ?? signature?.longName ?? null;

  if (access.assignOthers) {
    return (
      <Container>
        <SelectSaksbehandler {...oppgave} tildeltSaksbehandlerNavn={name} />
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

  const saksbehandler = `${name ?? 'Laster...'} (${oppgave.tildeltSaksbehandlerident})`;

  return (
    <Container>
      <StyledSaksbehandler title={saksbehandler}>{saksbehandler}</StyledSaksbehandler>
    </Container>
  );
};

interface ISelectSaksbehandlerProps extends Pick<IOppgave, 'id' | 'type' | 'ytelse' | 'tildeltSaksbehandlerident'> {
  tildeltSaksbehandlerNavn: string | null;
}

const SelectSaksbehandler = ({
  id,
  type,
  ytelse,
  tildeltSaksbehandlerident,
  tildeltSaksbehandlerNavn,
}: ISelectSaksbehandlerProps) => {
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
    return <LoadingCellContent />;
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
  width: 100%;
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
