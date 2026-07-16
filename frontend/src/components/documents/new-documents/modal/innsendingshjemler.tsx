import { Box, Checkbox } from '@navikt/ds-react';
import { useContext } from 'react';
import { Innsendingshjemler } from '@/components/behandling/behandlingsdetaljer/innsendingshjemmel';
import { ModalContext } from '@/components/documents/new-documents/modal/modal-context';
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
  const { validationErrors } = useContext(ModalContext);

  if (oppgave === undefined) {
    return null;
  }

  const innsendingshjemlerNotConfirmed = validationErrors.some(
    (e) =>
      e.dokumentId === dokumentId &&
      e.errors.includes(DocumentValidationFrontendError.INNSENDINGSHJEMLER_NOT_CONFIRMED),
  );

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
        <div className="w-90">Jeg bekrefter at innsendingshjemlene som skal følge saken til Trygderetten stemmer</div>
      </Checkbox>
    </Box>
  );
};
