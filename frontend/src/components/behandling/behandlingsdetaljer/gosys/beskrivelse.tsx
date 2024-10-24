import { GosysBeskrivelseTabs } from '@app/components/behandling/behandlingsdetaljer/gosys/beskrivelse-tabs';
import { Entry } from '@app/components/behandling/behandlingsdetaljer/gosys/entry';
import { splitBeskrivelse } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/split-beskrivelse';
import { StyledEntryList } from '@app/components/behandling/behandlingsdetaljer/gosys/styled-entry-list';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { usePushEvent } from '@app/observability';
import { Box, Button, Modal, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo, useRef } from 'react';
import { styled } from 'styled-components';

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
        <StyledEntryList>
          <Box background="surface-subtle" padding="2" borderRadius="medium">
            <Entry {...firstEntry} />
          </Box>
          {secondEntry !== undefined ? (
            <FadeOut $height={50}>
              <Box background="bg-subtle" padding="2" borderRadius="medium">
                <Entry {...secondEntry} />
              </Box>
            </FadeOut>
          ) : null}
        </StyledEntryList>

        <Button variant="tertiary" size="small" onClick={onOpenClick}>
          Vis alle ({entries.length})
        </Button>
      </VStack>

      <Modal header={{ heading: 'Beskrivelse fra Gosys', closeButton: true }} ref={modalRef} closeOnBackdropClick>
        <Modal.Body style={{ height: '80vh', overflow: 'hidden' }}>
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

const FadeOut = styled.div<{ $height: number; $fadeStart?: number }>`
  position: relative;
  overflow: hidden;
  height: ${({ $height }) => $height}px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${({ $height, $fadeStart = $height }) => $fadeStart}px;
    background: linear-gradient(transparent, var(--a-surface-default));
    z-index: 1;
    pointer-events: none;
  }
`;
