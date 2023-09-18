import { ErrorMessage, Select } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { useOppgaveActions } from '@app/hooks/use-oppgave-actions';
import { useGetPotentialSaksbehandlereQuery } from '@app/redux-api/oppgaver/queries/behandling';
import { IOppgave } from '@app/types/oppgaver';
import { useTildel } from './use-tildel';

const NOT_SELECTED = 'NOT_SELECTED';

export const Saksbehandler = (oppgave: IOppgave) => {
  const [access, isLoading] = useOppgaveActions(
    oppgave.tildeltSaksbehandler?.navIdent ?? null,
    oppgave.medunderskriver.navIdent !== null,
    oppgave.ytelseId,
  );

  if (isLoading) {
    return (
      <Container>
        <LoadingCellContent variant="rectangle" />
      </Container>
    );
  }

  if (access.assignOthers) {
    return (
      <Container>
        <SelectSaksbehandler
          {...oppgave}
          tildeltSaksbehandlerNavn={oppgave.tildeltSaksbehandler?.name ?? null}
          tildeltSaksbehandlerident={oppgave.tildeltSaksbehandler?.navIdent ?? null}
        />
      </Container>
    );
  }

  if (oppgave.tildeltSaksbehandler === null) {
    return (
      <Container>
        <StyledSaksbehandler>Ikke tildelt</StyledSaksbehandler>
      </Container>
    );
  }

  const saksbehandler = `${oppgave.tildeltSaksbehandler.name ?? 'Laster...'} (${
    oppgave.tildeltSaksbehandler.navIdent
  })`;

  return (
    <Container>
      <StyledSaksbehandler title={saksbehandler}>{saksbehandler}</StyledSaksbehandler>
    </Container>
  );
};

interface ISelectSaksbehandlerProps extends Pick<IOppgave, 'id' | 'typeId' | 'ytelseId'> {
  tildeltSaksbehandlerNavn: string | null;
  tildeltSaksbehandlerident: string | null;
}

const SelectSaksbehandler = ({
  id,
  typeId,
  ytelseId,
  tildeltSaksbehandlerident,
  tildeltSaksbehandlerNavn,
}: ISelectSaksbehandlerProps) => {
  const {
    data,
    isLoading: potentialSaksbehandlereIsLoading,
    isError: saksbehandlereIsError,
  } = useGetPotentialSaksbehandlereQuery(id);
  const [tildel, { isLoading }] = useTildel(id, typeId, ytelseId);

  if (saksbehandlereIsError) {
    return <StyledErrorMessage>Feil ved lasting</StyledErrorMessage>;
  }

  if (potentialSaksbehandlereIsLoading || typeof data === 'undefined') {
    return <LoadingCellContent variant="rectangle" />;
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

  const valid =
    tildeltSaksbehandlerident === null ||
    data.saksbehandlere.some(({ navIdent }) => navIdent === tildeltSaksbehandlerident);

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
      {!valid ? (
        <option value={tildeltSaksbehandlerident}>Ugyldig saksbehandler ({tildeltSaksbehandlerident})</option>
      ) : null}
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
