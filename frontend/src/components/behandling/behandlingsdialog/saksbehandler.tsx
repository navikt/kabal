import { BodyShort, Label, Skeleton, VStack } from '@navikt/ds-react';
import { FortroligWarning } from '@/components/behandling/behandlingsdialog/fortrolig-warning';
import { useTildel } from '@/components/oppgavestyring/use-tildel';
import { SearchableNavEmployeeSelectWithLabel } from '@/components/searchable-select/searchable-single-select/searchable-nav-employee-select-with-label';
import { hasFortroligFamily, hasFortroligStatus } from '@/domain/is-fortrolig';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@/hooks/use-has-role';
import { useIsFeilregistrert } from '@/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useGetPotentialSaksbehandlereQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { Role } from '@/types/bruker';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

const ID = 'tildelt-saksbehandler';

export const Saksbehandler = () => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const isSaksbehandler = useIsTildeltSaksbehandler();
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const isFullfoert = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();

  if (oppgaveIsLoading || oppgave === undefined) {
    return null;
  }

  const showSelect = !(isFeilregistrert || isFullfoert) && (isSaksbehandler || hasOppgavestyringRole);

  const { saksbehandler, sakenGjelder } = oppgave;

  if (hasFortroligStatus(sakenGjelder.statusList)) {
    return <Warning />;
  }

  if (hasFortroligFamily(sakenGjelder)) {
    return <Warning family />;
  }

  return (
    <VStack gap="space-8" marginBlock="space-0 space-1">
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

  return (
    <SearchableNavEmployeeSelectWithLabel
      nullLabel="Ikke tildelt"
      label="Saksbehandler"
      onChange={tildel}
      value={saksbehandler}
      options={potentialSaksbehandlere.saksbehandlere}
      confirmLabel="Tildel"
    />
  );
};

interface WarningProps {
  family?: boolean;
}

const Warning = ({ family = false }: WarningProps) => (
  <FortroligWarning heading="Saksbehandler">
    Du kan ikke tildele til en annen saksbehandler fordi saken gjelder en bruker med fortrolig adresse
    {family ? ' (familieforhold)' : ''}. Skal du ikke behandle saken må du legge den tilbake.
  </FortroligWarning>
);
