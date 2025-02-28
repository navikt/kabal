import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { VarsletFristModal } from '@app/components/behandling/behandlingsdetaljer/varslet-frist/modal';
import { isoDateToPretty } from '@app/domain/date';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { PencilIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useRef } from 'react';

interface Props {
  oppgavebehandling: IOppgavebehandling;
  children?: React.ReactNode;
}

export const VarsletFrist = ({ oppgavebehandling, children }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { varsletFrist } = oppgavebehandling;

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

        <Button
          variant="secondary"
          size="small"
          icon={<PencilIcon aria-hidden />}
          onClick={() => modalRef.current?.showModal()}
        >
          Varsle om ny frist
        </Button>
      </BehandlingSection>

      <VarsletFristModal oppgavebehandling={oppgavebehandling} modalRef={modalRef}>
        {children}
      </VarsletFristModal>
    </>
  );
};
