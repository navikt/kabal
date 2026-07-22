import { Box, Checkbox, HelpText, HStack, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { DatePicker } from '@/components/date-picker/date-picker';
import { hasPaaanketVedtaksdato } from '@/components/documents/new-documents/has-tr-fields';
import type { BaseFieldProps } from '@/components/documents/new-documents/modal/trygderetten-fields/base-field-props';
import { useHasValidationError } from '@/components/documents/new-documents/modal/use-has-validation-error';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useSetPaaanketVedtaksdatoMutation } from '@/redux-api/oppgaver/mutations/behandling-dates';
import { DocumentValidationFrontendError } from '@/types/documents/validation';

interface PaaanketVedtaksdatoFieldProps extends BaseFieldProps {
  klagevedtakDatoConfirmed: boolean;
  setKlagevedtakDatoConfirmed: (confirmed: boolean) => void;
}

export const PaaanketVedtaksdatoField = ({ templateId, ...rest }: PaaanketVedtaksdatoFieldProps) =>
  hasPaaanketVedtaksdato(templateId) ? <PaaanketVedtaksdatoFieldInner {...rest} /> : null;

type PaaanketVedtaksdatoFieldInnerProps = Omit<PaaanketVedtaksdatoFieldProps, 'templateId'>;

const PaaanketVedtaksdatoFieldInner = ({
  dokumentId,
  klagevedtakDatoConfirmed,
  setKlagevedtakDatoConfirmed,
  disabled,
}: PaaanketVedtaksdatoFieldInnerProps) => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave } = useOppgave();
  const [setPaaanketVedtaksdato] = useSetPaaanketVedtaksdatoMutation();
  const klagevedtakDatoNotConfirmed = useHasValidationError(
    dokumentId,
    DocumentValidationFrontendError.KLAGEVEDTAK_DATO_NOT_CONFIRMED,
  );

  if (oppgaveId === skipToken || oppgave === undefined) {
    return null;
  }

  return (
    <Box padding="space-8" borderRadius="4" background="warning-soft" borderWidth="1" borderColor="warning">
      <VStack gap="space-8">
        <DatePicker
          size="small"
          preventClear
          label={
            <HStack align="center" gap="space-4">
              Dato for klagevedtaket som er påanket
              <HelpText>
                Forslag til dato er basert på når klagebehandlingen i Kabal ble fullført. Dersom dato ikke stemmer med
                dato for klagevedtaket, må du endre dato her.
              </HelpText>
            </HStack>
          }
          value={oppgave.paaanketVedtaksdato}
          disabled={disabled}
          onChange={(paaanketVedtaksdato) => {
            if (paaanketVedtaksdato === null) {
              return;
            }

            setKlagevedtakDatoConfirmed(false);
            setPaaanketVedtaksdato({ oppgaveId, paaanketVedtaksdato });
          }}
        />
        <Checkbox
          checked={klagevedtakDatoConfirmed}
          onChange={({ target }) => setKlagevedtakDatoConfirmed(target.checked)}
          error={klagevedtakDatoNotConfirmed}
          errorId={
            klagevedtakDatoNotConfirmed
              ? `${dokumentId}-${DocumentValidationFrontendError.KLAGEVEDTAK_DATO_NOT_CONFIRMED}`
              : undefined
          }
          size="small"
          disabled={disabled}
        >
          Jeg bekrefter at dato stemmer
        </Checkbox>
      </VStack>
    </Box>
  );
};
