import { useTildel } from '@app/components/oppgavestyring/use-tildel';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetPotentialSaksbehandlereQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { Role } from '@app/types/bruker';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { BodyShort, Label, Select, Skeleton, VStack } from '@navikt/ds-react';

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

  const showSelect = !(isFeilregistrert || isFullfoert) && (isSaksbehandler || hasOppgavestyringRole);

  const { saksbehandler } = oppgave;

  return (
    <VStack gap="2" marginBlock="0 4">
      {showSelect ? (
        <SelectSaksbehandler oppgave={oppgave} />
      ) : (
        <>
          <Label size="small" htmlFor={ID}>
            Saksbehandler
          </Label>
          <BodyShort id={ID}>{saksbehandler === null ? 'Ikke tildelt' : saksbehandler.navn}</BodyShort>
        </>
      )}
    </VStack>
  );
};

const NONE = 'NONE';

interface SelectSaksbehandlerProps {
  oppgave: IOppgavebehandling;
}

const SelectSaksbehandler = ({ oppgave: { saksbehandler, id, typeId, ytelseId } }: SelectSaksbehandlerProps) => {
  const { data: potentialSaksbehandlere } = useGetPotentialSaksbehandlereQuery(id);
  const [tildel] = useTildel(id, typeId, ytelseId);

  if (potentialSaksbehandlere === undefined) {
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
    const employee = potentialSaksbehandlere.saksbehandlere.find((s) => s.navIdent === target.value);

    if (employee === undefined) {
      return;
    }

    tildel(employee);
  };

  const options = potentialSaksbehandlere.saksbehandlere.map(({ navn, navIdent }) => (
    <option key={navIdent} value={navIdent}>
      {navn}
    </option>
  ));

  const noneSelectedOption = saksbehandler === null ? <option value={NONE}>Ingen valgt</option> : null;

  return (
    <Select label="Saksbehandler" size="small" onChange={onChange} value={saksbehandler?.navIdent ?? NONE}>
      {noneSelectedOption}
      {options}
    </Select>
  );
};
