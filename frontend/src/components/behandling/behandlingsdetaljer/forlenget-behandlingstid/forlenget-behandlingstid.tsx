import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useState } from 'react';
import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { VarsletFristModal } from '@/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/modal';
import { TimesPreviouslyExtended } from '@/components/times-previously-extended/times-previously-extended';
import { isoDateToPretty } from '@/domain/date';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useHasRole } from '@/hooks/use-has-role';
import { Role } from '@/types/bruker';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

interface Props {
  oppgavebehandling: IOppgavebehandling;
  children?: React.ReactNode;
}

export const ForlengetBehandlingstid = ({ oppgavebehandling, children }: Props) => {
  const { varsletFrist, timesPreviouslyExtended } = oppgavebehandling;
  const [isOpen, setIsOpen] = useState(false);
  const canEdit = useCanEditBehandling();
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);

  return (
    <>
      <BehandlingSection label="Varslet frist">
        <HStack justify="space-between">
          <span>{varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}</span>
        </HStack>

        {canEdit || hasOppgavestyringRole ? (
          <HStack gap="space-8" align="center">
            <Button
              data-color="neutral"
              variant="secondary"
              size="small"
              icon={<PencilIcon aria-hidden />}
              onClick={() => setIsOpen(!isOpen)}
            >
              Varsle om ny frist
            </Button>
            <TimesPreviouslyExtended timesPreviouslyExtended={timesPreviouslyExtended} />
          </HStack>
        ) : null}
      </BehandlingSection>
      <VarsletFristModal oppgavebehandling={oppgavebehandling} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {children}
      </VarsletFristModal>
    </>
  );
};
