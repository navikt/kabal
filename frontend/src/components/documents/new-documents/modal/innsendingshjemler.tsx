import { Innsendingshjemler } from '@app/components/behandling/behandlingsdetaljer/innsendingshjemmel';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { Box, Checkbox } from '@navikt/ds-react';

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
    <Box
      padding="2"
      borderRadius="medium"
      background="surface-warning-subtle"
      borderWidth="1"
      borderColor="border-warning"
    >
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
