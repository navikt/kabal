import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { Complete } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/complete';
import { Inputs } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/inputs';
import { Pdf } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/pdf';
import { isoDateToPretty } from '@app/domain/date';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Button, ErrorMessage, HStack, Modal, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

interface Props {
  oppgavebehandling: IOppgavebehandling;
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const VarsletFristModal = ({ oppgavebehandling, children, isOpen, onClose }: Props) => {
  const [error, setError] = useState<string>();
  const { varsletFrist } = oppgavebehandling;
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken) {
    return;
  }

  return (
    <Modal
      header={{ heading: 'Send brev om lengre saksbehandlingstid' }}
      width="2000px"
      closeOnBackdropClick
      open={isOpen}
      onClose={onClose}
    >
      <Modal.Body className="flex h-[80vh] w-full gap-9">
        <VStack minWidth="520px" style={{ flexShrink: 0 }} className="overflow-y-auto">
          <HStack gap="4">
            {children}

            <BehandlingSection label="Varslet frist">
              <span>{varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}</span>
            </BehandlingSection>
          </HStack>

          {isOpen ? <Inputs /> : null}

          {error === undefined ? null : (
            <ErrorMessage size="small" className="mt-8">
              {error}
            </ErrorMessage>
          )}
        </VStack>

        {isOpen ? <Pdf id={oppgaveId} /> : null}
      </Modal.Body>

      <Modal.Footer>
        {isOpen ? <Complete id={oppgaveId} onClose={onClose} setError={setError} /> : null}

        <Button size="small" variant="secondary" onClick={onClose}>
          Lukk
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
