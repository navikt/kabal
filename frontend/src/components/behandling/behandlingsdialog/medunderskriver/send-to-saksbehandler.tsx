import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack, VStack } from '@navikt/ds-react';
import { useIsAssignedMedunderskriverAndSent } from '@/hooks/use-is-medunderskriver';
import { useSetMedunderskriverFlowStateMutation } from '@/redux-api/oppgaver/mutations/set-medunderskriver-flowstate';
import { FlowState, type IMedunderskriver, ReviewFlowState } from '@/types/oppgave-common';

interface Props {
  oppgaveId: string;
  medunderskriver: IMedunderskriver;
}

export const SendToSaksbehandler = ({ oppgaveId, medunderskriver }: Props) => {
  const isMedunderskriver = useIsAssignedMedunderskriverAndSent();
  const [setFlowState, { isLoading }] = useSetMedunderskriverFlowStateMutation();

  const { flowState } = medunderskriver;

  if (
    !isMedunderskriver ||
    flowState === FlowState.RETURNED ||
    flowState === ReviewFlowState.APPROVED ||
    flowState === ReviewFlowState.REJECTED
  ) {
    return null;
  }

  return (
    <VStack gap="space-8">
      <Heading size="xsmall">Returner til saksbehandler</Heading>
      <HStack justify="space-between">
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={() => setFlowState({ oppgaveId, flowState: ReviewFlowState.APPROVED })}
          disabled={isLoading}
          loading={isLoading}
          icon={<CheckmarkIcon aria-hidden />}
        >
          Godkjenn
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={() => setFlowState({ oppgaveId, flowState: ReviewFlowState.REJECTED })}
          disabled={isLoading}
          loading={isLoading}
          icon={<XMarkIcon aria-hidden />}
        >
          Ikke godkjenn
        </Button>
      </HStack>
    </VStack>
  );
};
