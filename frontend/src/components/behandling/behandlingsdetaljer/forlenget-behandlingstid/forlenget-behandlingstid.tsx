import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { VarsletFristModal } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/modal';
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
  const { varsletFrist } = oppgavebehandling;
  const [isOpen, setIsOpen] = useState(false);
  const canEdit = useCanEditBehandling();
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);

  return (
    <>
      {children}

      <BehandlingSection label="Varslet frist">
        <HStack justify="space-between">
          <span>{varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}</span>
          {/* <Button
            variant="tertiary"
            size="xsmall"
            icon={<PencilIcon aria-hidden />}
          /> */}
        </HStack>

        {canEdit || hasOppgavestyringRole ? (
          <Button variant="secondary" size="small" icon={<PencilIcon aria-hidden />} onClick={() => setIsOpen(!isOpen)}>
            Varsle om ny frist
          </Button>
        ) : null}
      </BehandlingSection>

      <VarsletFristModal oppgavebehandling={oppgavebehandling} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {children}
      </VarsletFristModal>
    </>
  );
};
