import { Button, Dialog, ErrorSummary, HStack, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useRef, useState } from 'react';
import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { Complete } from '@/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/complete';
import { DoNotSendLetter } from '@/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/do-not-send-letter';
import { Inputs } from '@/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/inputs';
import { Pdf } from '@/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/pdf';
import { TimesPreviouslyExtended } from '@/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/times-previously-extended';
import { isoDateToPretty } from '@/domain/date';
import type { IValidationSection } from '@/functions/error-type-guard';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useGetOrCreateQuery } from '@/redux-api/forlenget-behandlingstid';
import type { UtvidetBehandlingstidFieldName } from '@/types/field-names';
import { UTVIDET_BEHANDLINGSTID_FIELD_NAMES } from '@/types/field-names';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

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
  const [behandlingstidError, setBehandlingstidError] = useState<string>();

  if (oppgaveId === skipToken) {
    return;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Popup width="2000px">
        <Dialog.Header>
          <Dialog.Title>{heading}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="flex h-[80vh] w-full gap-9">
          <VStack width="780px" padding="space-4" overflowY="auto" flexShrink="0" gap="space-16">
            <VStack gap="space-16">
              <TimesPreviouslyExtended />
              <DoNotSendLetter varsletFrist={varsletFrist} setBehandlingstidError={setBehandlingstidError} />
            </VStack>

            <HStack gap="space-16">
              {children}

              <BehandlingSection label="Varslet frist">
                <span>{varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}</span>
              </BehandlingSection>
            </HStack>

            <Inputs behandlingstidError={behandlingstidError} setBehandlingstidError={setBehandlingstidError} />

            <Errors sections={error} />
          </VStack>

          <Pdf id={oppgaveId} varsletFrist={varsletFrist} />
        </Dialog.Body>
        <Dialog.Footer>
          <Complete id={oppgaveId} onClose={onClose} setError={setError} />

          <Button data-color="neutral" size="small" variant="secondary" onClick={onClose}>
            Lukk
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
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
