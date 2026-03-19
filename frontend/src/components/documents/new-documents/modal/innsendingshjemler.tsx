import { Box, Checkbox } from '@navikt/ds-react';
import { Innsendingshjemler } from '@/components/behandling/behandlingsdetaljer/innsendingshjemmel';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';

interface Props {
  setInnsendingshjemlerConfirmed: (confirmed: boolean) => void;
  innsendingshjemlerConfirmed: boolean;
}

export const ConfirmInnsendingshjemler = ({ setInnsendingshjemlerConfirmed, innsendingshjemlerConfirmed }: Props) => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return null;
  }

  return (
    <Box padding="space-8" borderRadius="4" background="warning-soft" borderWidth="1" borderColor="warning">
      <Innsendingshjemler oppgavebehandling={oppgave} />
      <Checkbox
        onChange={({ target }) => setInnsendingshjemlerConfirmed(target.checked)}
        checked={innsendingshjemlerConfirmed}
      >
        <div className="w-90">Jeg bekrefter at innsendingshjemlene som skal følge saken til Trygderetten stemmer</div>
      </Checkbox>
    </Box>
  );
};
