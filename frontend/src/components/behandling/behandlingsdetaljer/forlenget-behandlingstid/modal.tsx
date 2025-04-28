import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { Complete } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/complete';
import { DoNotSendLetter } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/do-not-send-letter';
import { Inputs } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/inputs';
import { Pdf } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/pdf';
import { TimesPreviouslyExtended } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/times-previously-extended';
import { isoDateToPretty } from '@app/domain/date';
import type { IValidationSection } from '@app/functions/error-type-guard';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetOrCreateQuery } from '@app/redux-api/forlenget-behandlingstid';
import type { UtvidetBehandlingstidFieldName } from '@app/types/field-names';
import { UTVIDET_BEHANDLINGSTID_FIELD_NAMES } from '@app/types/field-names';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Button, ErrorSummary, HStack, Modal, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useRef, useState } from 'react';

interface Props {
  oppgavebehandling: IOppgavebehandling;
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const VarsletFristModal = ({ oppgavebehandling, children, isOpen, onClose }: Props) => {
  const [error, setError] = useState<IValidationSection[]>([]);
  const { varsletFrist } = oppgavebehandling;
  const oppgaveId = useOppgaveId();
  const heading = useHeading(isOpen);

  if (oppgaveId === skipToken) {
    return;
  }

  return (
    <Modal header={{ heading }} width="2000px" closeOnBackdropClick open={isOpen} onClose={onClose}>
      <Modal.Body className="flex h-[80vh] w-full gap-9">
        <VStack width="780px" padding="1" overflowY="auto" flexShrink="0" gap="4">
          <VStack gap="4">
            {isOpen ? <TimesPreviouslyExtended /> : null}
            {isOpen ? <DoNotSendLetter /> : null}
          </VStack>

          <HStack gap="4">
            {children}

            <BehandlingSection label="Varslet frist">
              <span>{varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}</span>
            </BehandlingSection>
          </HStack>

          {isOpen ? <Inputs /> : null}

          <Errors sections={error} />
        </VStack>

        {isOpen ? <Pdf id={oppgaveId} varsletFrist={varsletFrist} /> : null}
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

const useHeading = (isOpen: boolean): string => {
  const oppgaveId = useOppgaveId();
  const { data } = useGetOrCreateQuery(isOpen ? oppgaveId : skipToken);

  return data?.doNotSendLetter === true
    ? 'Endre varslet frist uten å sende brev'
    : 'Send brev om lengre saksbehandlingstid';
};

const Errors = ({ sections }: { sections: IValidationSection[] }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sections.length > 0) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sections]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <ErrorSummary ref={ref}>
      {sections.flatMap(({ properties }) =>
        properties.map(({ field, reason }) => (
          <ErrorSummary.Item key={field} href={`#${field}`}>
            {UTVIDET_BEHANDLINGSTID_FIELD_NAMES[field as UtvidetBehandlingstidFieldName] ?? field}: {reason}
          </ErrorSummary.Item>
        )),
      )}
    </ErrorSummary>
  );
};
