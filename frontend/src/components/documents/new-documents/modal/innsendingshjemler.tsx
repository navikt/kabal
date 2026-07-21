import { Box, Checkbox } from '@navikt/ds-react';
import { Innsendingshjemler } from '@/components/behandling/behandlingsdetaljer/innsendingshjemmel';
import { useHasValidationError } from '@/components/documents/new-documents/modal/use-has-validation-error';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { DocumentValidationFrontendError } from '@/types/documents/validation';

interface Props {
  dokumentId: string;
  setInnsendingshjemlerConfirmed: (confirmed: boolean) => void;
  innsendingshjemlerConfirmed: boolean;
  disabled?: boolean;
}

export const ConfirmInnsendingshjemler = ({
  dokumentId,
  setInnsendingshjemlerConfirmed,
  innsendingshjemlerConfirmed,
  disabled = false,
}: Props) => {
  const { data: oppgave } = useOppgave();
  const innsendingshjemlerNotConfirmed = useHasValidationError(
    dokumentId,
    DocumentValidationFrontendError.INNSENDINGSHJEMLER_NOT_CONFIRMED,
  );

  if (oppgave === undefined) {
    return null;
  }

  return (
    <Box padding="space-8" borderRadius="4" background="warning-soft" borderWidth="1" borderColor="warning">
      <Innsendingshjemler oppgavebehandling={oppgave} disabled={disabled} />
      <Checkbox
        onChange={({ target }) => setInnsendingshjemlerConfirmed(target.checked)}
        checked={innsendingshjemlerConfirmed}
        error={innsendingshjemlerNotConfirmed}
        errorId={
          innsendingshjemlerNotConfirmed
            ? `${dokumentId}-${DocumentValidationFrontendError.INNSENDINGSHJEMLER_NOT_CONFIRMED}`
            : undefined
        }
        size="small"
        className="mt-1"
        disabled={disabled}
      >
        Jeg bekrefter at innsendingshjemlene som skal følge saken til Trygderetten stemmer
      </Checkbox>
    </Box>
  );
};
