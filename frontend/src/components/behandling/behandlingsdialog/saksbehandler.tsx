import { BodyShort, Label, Select, Skeleton } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { styled } from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useTildelSaksbehandlerMutation } from '@app/redux-api/oppgaver/mutations/tildeling';
import { useGetPotentialSaksbehandlereQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { Role } from '@app/types/bruker';

const ID = 'tildelt-saksbehandler';

export const Saksbehandler = () => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const isSaksbehandler = useIsSaksbehandler();
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const isFullfoert = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();

  if (oppgaveIsLoading || oppgave === undefined) {
    return null;
  }

  const showSelect = !isFeilregistrert && !isFullfoert && (isSaksbehandler || hasOppgavestyringRole);

  const { saksbehandler } = oppgave;

  return (
    <Container>
      {showSelect ? (
        <SelectSaksbehandler />
      ) : (
        <>
          <Label size="small" htmlFor={ID}>
            Saksbehandler
          </Label>
          <BodyShort id={ID}>{saksbehandler === null ? 'Ikke tildelt' : saksbehandler.navn}</BodyShort>
        </>
      )}
    </Container>
  );
};

const NONE = 'NONE';

const SelectSaksbehandler = () => {
  const { data: oppgave } = useOppgave();
  const { data: potentialSaksbehandlere } = useGetPotentialSaksbehandlereQuery(oppgave?.id ?? skipToken);
  const [tildel] = useTildelSaksbehandlerMutation();

  if (oppgave === undefined || potentialSaksbehandlere === undefined) {
    return (
      <>
        <Label size="small" htmlFor={ID}>
          Saksbehandler
        </Label>
        <Skeleton height={32} id={ID} />
      </>
    );
  }

  const onChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    const employee = potentialSaksbehandlere.saksbehandlere.find((s) => s.navIdent === target.value)!;
    tildel({ oppgaveId: oppgave.id, employee });
  };

  const options = potentialSaksbehandlere.saksbehandlere.map(({ navn, navIdent }) => (
    <option key={navIdent} value={navIdent}>
      {navn}
    </option>
  ));

  const noneSelectedOption = oppgave.saksbehandler === null ? <option value={NONE}>Ingen valgt</option> : null;

  return (
    <Select label="Saksbehandler" size="small" onChange={onChange} value={oppgave.saksbehandler?.navIdent ?? NONE}>
      {noneSelectedOption}
      {options}
    </Select>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;
