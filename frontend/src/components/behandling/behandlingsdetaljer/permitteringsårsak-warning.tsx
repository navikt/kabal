import { LocalAlert } from '@navikt/ds-react';
import { FAGSYSTEM_ARENA } from '@/components/oppgavebehandling-footer/fagsystem';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum } from '@/types/kodeverk';

interface Props {
  className?: string;
}

export const PermitteringsårsakWarning = ({ className }: Props) => {
  const { data, isSuccess } = useOppgave();

  if (!isSuccess) {
    return null;
  }

  if (data.typeId !== SaksTypeEnum.ANKE && data.typeId !== SaksTypeEnum.KLAGE) {
    return null;
  }

  if (data.fagsystemId !== FAGSYSTEM_ARENA) {
    return null;
  }

  return (
    <LocalAlert status="warning" size="small" className={className}>
      <LocalAlert.Header>
        <LocalAlert.Title>Advarsel</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        Sjekk om det er flere saker knyttet til samme firma. Du kan søke opp firmanavn i Arena for å få en oversikt. Søk
        opp fødselsnummer og tildel deg alle saker i Kabal som gjelder samme firma.
      </LocalAlert.Content>
    </LocalAlert>
  );
};
