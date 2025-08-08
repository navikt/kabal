import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { VarsletFristModal } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/modal';
import { TimesPreviouslyExtended } from '@app/components/times-previously-extended/times-previously-extended';
import { isoDateToPretty } from '@app/domain/date';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useHasRole } from '@app/hooks/use-has-role';
import { Role } from '@app/types/bruker';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useState } from 'react';

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
          <HStack gap="2" align="center">
            <Button
              variant="secondary-neutral"
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
