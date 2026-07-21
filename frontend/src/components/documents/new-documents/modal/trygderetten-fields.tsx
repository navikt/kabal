import { Box, Checkbox, HelpText, HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { DatePicker } from '@/components/date-picker/date-picker';
import { VALIDATION_ERROR_MESSAGES } from '@/components/documents/new-documents/modal/finish-document/error-messages';
import { ConfirmInnsendingshjemler } from '@/components/documents/new-documents/modal/innsendingshjemler';
import { useHasValidationError } from '@/components/documents/new-documents/modal/use-has-validation-error';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useSetPaaanketVedtaksdatoMutation } from '@/redux-api/oppgaver/mutations/behandling-dates';
import { useSetForsterketRettMutation } from '@/redux-api/oppgaver/mutations/set-forsterket-rett';
import { DocumentValidationApiError, DocumentValidationFrontendError } from '@/types/documents/validation';

interface Props {
  dokumentId: string;
  klagevedtakDatoConfirmed: boolean;
  setKlagevedtakDatoConfirmed: (confirmed: boolean) => void;
  innsendingshjemlerConfirmed: boolean;
  setInnsendingshjemlerConfirmed: (confirmed: boolean) => void;
  disabled?: boolean;
}

export const TrygderettenFields = ({
  dokumentId,
  klagevedtakDatoConfirmed,
  setKlagevedtakDatoConfirmed,
  innsendingshjemlerConfirmed,
  setInnsendingshjemlerConfirmed,
  disabled = false,
}: Props) => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave } = useOppgave();
  const [setPaaanketVedtaksdato] = useSetPaaanketVedtaksdatoMutation();
  const [setForsterketRett] = useSetForsterketRettMutation();
  const klagevedtakDatoNotConfirmed = useHasValidationError(
    dokumentId,
    DocumentValidationFrontendError.KLAGEVEDTAK_DATO_NOT_CONFIRMED,
  );
  const forsterketRettNotAnswered = useHasValidationError(
    dokumentId,
    DocumentValidationApiError.FORSTERKET_RETT_NOT_SET,
  );

  if (oppgaveId === skipToken || oppgave === undefined) {
    return null;
  }

  return (
    <>
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

      <Box padding="space-8" borderRadius="4" background="warning-soft" borderWidth="1" borderColor="warning">
        <RadioGroup
          legend="Har klageinstansen eller den ankende part bedt om at Trygderetten settes med forsterket rett?"
          size="small"
          value={oppgave.forsterketRett === null ? null : oppgave.forsterketRett.toString()}
          onChange={(value: string) => setForsterketRett({ oppgaveId, forsterketRett: value === 'true' })}
          disabled={disabled}
          error={
            forsterketRettNotAnswered
              ? VALIDATION_ERROR_MESSAGES[DocumentValidationApiError.FORSTERKET_RETT_NOT_SET]
              : null
          }
          errorId={
            forsterketRettNotAnswered
              ? `${dokumentId}-${DocumentValidationApiError.FORSTERKET_RETT_NOT_SET}`
              : undefined
          }
        >
          <HStack gap="space-16">
            <Radio value="true">Ja</Radio>
            <Radio value="false">Nei</Radio>
          </HStack>
        </RadioGroup>
      </Box>

      <ConfirmInnsendingshjemler
        dokumentId={dokumentId}
        innsendingshjemlerConfirmed={innsendingshjemlerConfirmed}
        setInnsendingshjemlerConfirmed={setInnsendingshjemlerConfirmed}
        disabled={disabled}
      />
    </>
  );
};
