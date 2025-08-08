import { GosysBeskrivelseTabs } from '@app/components/gosys/beskrivelse/beskrivelse-tabs';
import { Entry } from '@app/components/gosys/beskrivelse/entry';
import { splitBeskrivelse } from '@app/components/gosys/beskrivelse/parsing/split-beskrivelse';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { usePushEvent } from '@app/observability';
import { BoxNew, Button, Modal, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo, useRef } from 'react';

interface Props {
  oppgavebeskrivelse: string;
}

export const GosysBeskrivelse = ({ oppgavebeskrivelse }: Props) => {
  const oppgaveId = useOppgaveIdString();
  const modalRef = useRef<HTMLDialogElement>(null);
  const trimmedBeskrivelse = oppgavebeskrivelse.trim();
  const entries = useMemo(() => splitBeskrivelse(oppgavebeskrivelse), [oppgavebeskrivelse]);
  const pushEvent = usePushEvent();

  const onOpenClick = useCallback(() => {
    modalRef.current?.showModal();
    pushEvent('open-gosys-description', {
      entries: entries.length.toString(10),
      oppgaveId,
    });
  }, [entries.length, oppgaveId, pushEvent]);

  const [firstEntry, secondEntry] = entries;

  if (firstEntry === undefined) {
    return null;
  }

  return (
    <>
      <VStack gap="2">
        <VStack as="ul" gap="2">
          <BoxNew background="neutral-soft" padding="2" borderRadius="medium">
            <Entry {...firstEntry} />
          </BoxNew>
          {secondEntry !== undefined ? (
            <div className="relative z-1 h-12 overflow-hidden after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:left-0 after:h-12 after:bg-gradient-to-t after:from-ax-bg-default after:to-transparent">
              <BoxNew background="neutral-soft" padding="2" borderRadius="medium">
                <Entry {...secondEntry} />
              </BoxNew>
            </div>
          ) : null}
        </VStack>

        <Button variant="tertiary-neutral" size="small" onClick={onOpenClick}>
          Vis alle ({entries.length})
        </Button>
      </VStack>

      <Modal header={{ heading: 'Beskrivelse fra Gosys', closeButton: true }} ref={modalRef} closeOnBackdropClick>
        <Modal.Body className="h-[80vh] overflow-hidden">
          <GosysBeskrivelseTabs beskrivelse={trimmedBeskrivelse} entries={entries} />
        </Modal.Body>
      </Modal>
    </>
  );
};

const useOppgaveIdString = () => {
  const oppgaveId = useOppgaveId();

  return oppgaveId === skipToken ? 'unknown' : oppgaveId;
};
