import { Box, HStack, Radio, RadioGroup } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { hasForsterketRett } from '@/components/documents/new-documents/has-tr-fields';
import { VALIDATION_ERROR_MESSAGES } from '@/components/documents/new-documents/modal/finish-document/error-messages';
import type { BaseFieldProps } from '@/components/documents/new-documents/modal/trygderetten-fields/base-field-props';
import { useHasValidationError } from '@/components/documents/new-documents/modal/use-has-validation-error';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useSetForsterketRettMutation } from '@/redux-api/oppgaver/mutations/set-forsterket-rett';
import { DocumentValidationApiError } from '@/types/documents/validation';

type ForsterketRettFieldProps = BaseFieldProps;

export const ForsterketRettField = ({ templateId, ...rest }: ForsterketRettFieldProps) =>
  hasForsterketRett(templateId) ? <ForsterketRettFieldInner {...rest} /> : null;

type ForsterketRettFieldInnerProps = Omit<ForsterketRettFieldProps, 'templateId'>;

const ForsterketRettFieldInner = ({ dokumentId, disabled }: ForsterketRettFieldInnerProps) => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave } = useOppgave();
  const [setForsterketRett] = useSetForsterketRettMutation();
  const forsterketRettNotAnswered = useHasValidationError(
    dokumentId,
    DocumentValidationApiError.FORSTERKET_RETT_NOT_SET,
  );

  if (oppgaveId === skipToken || oppgave === undefined) {
    return null;
  }

  return (
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
          forsterketRettNotAnswered ? `${dokumentId}-${DocumentValidationApiError.FORSTERKET_RETT_NOT_SET}` : undefined
        }
      >
        <HStack gap="space-16">
          <Radio value="true">Ja</Radio>
          <Radio value="false">Nei</Radio>
        </HStack>
      </RadioGroup>
    </Box>
  );
};
