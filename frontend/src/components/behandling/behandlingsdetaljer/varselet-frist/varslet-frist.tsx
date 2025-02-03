import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { VarseletFristModal } from '@app/components/behandling/behandlingsdetaljer/varselet-frist/modal';
import { isoDateToPretty } from '@app/domain/date';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack, Tooltip } from '@navikt/ds-react';
import { useRef } from 'react';

interface Props {
  oppgavebehandling: IOppgavebehandling;
  children?: React.ReactNode;
}

export const VarseletFrist = ({ oppgavebehandling, children }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { varsletFrist } = oppgavebehandling;

  return (
    <>
      {children}

      <BehandlingSection label="Varslet frist">
        <HStack justify="space-between">
          <span>{varsletFrist === null ? 'Ikke satt' : isoDateToPretty(varsletFrist)}</span>

          <Tooltip content="Varsle ny frist" describesChild>
            <Button
              variant="tertiary"
              size="xsmall"
              icon={<PencilIcon aria-hidden />}
              onClick={() => modalRef.current?.showModal()}
            />
          </Tooltip>
        </HStack>
      </BehandlingSection>

      <VarseletFristModal oppgavebehandling={oppgavebehandling} modalRef={modalRef}>
        {children}
      </VarseletFristModal>
    </>
  );
};
