import { Box, Button, Dialog, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo } from 'react';
import { GosysBeskrivelseTabs } from '@/components/gosys/beskrivelse/beskrivelse-tabs';
import { Entry } from '@/components/gosys/beskrivelse/entry';
import { splitBeskrivelse } from '@/components/gosys/beskrivelse/parsing/split-beskrivelse';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { usePushEvent } from '@/observability';

interface Props {
  oppgavebeskrivelse: string;
}

export const GosysBeskrivelse = ({ oppgavebeskrivelse }: Props) => {
  const oppgaveId = useOppgaveIdString();
  const trimmedBeskrivelse = oppgavebeskrivelse.trim();
  const entries = useMemo(() => splitBeskrivelse(oppgavebeskrivelse), [oppgavebeskrivelse]);
  const pushEvent = usePushEvent();

  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        pushEvent('open-gosys-description', {
          entries: entries.length.toString(10),
          oppgaveId,
        });
      }
    },
    [entries.length, oppgaveId, pushEvent],
  );

  const [firstEntry, secondEntry] = entries;

  if (firstEntry === undefined) {
    return null;
  }

  return (
    <Dialog onOpenChange={onOpenChange}>
      <VStack gap="space-8">
        <VStack as="ul" gap="space-8">
          <Box background="neutral-soft" padding="space-8" borderRadius="4">
            <Entry {...firstEntry} />
          </Box>
          {secondEntry !== undefined ? (
            <div className="relative z-1 h-12 overflow-hidden after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:left-0 after:h-12 after:bg-gradient-to-t after:from-ax-bg-default after:to-transparent">
              <Box background="neutral-soft" padding="space-8" borderRadius="4">
                <Entry {...secondEntry} />
              </Box>
            </div>
          ) : null}
        </VStack>

        <Dialog.Trigger>
          <Button data-color="neutral" variant="tertiary" size="small">
            Vis alle ({entries.length})
          </Button>
        </Dialog.Trigger>
      </VStack>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Beskrivelse fra Gosys</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="h-[80vh] overflow-hidden">
          <GosysBeskrivelseTabs beskrivelse={trimmedBeskrivelse} entries={entries} />
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  );
};

const useOppgaveIdString = () => {
  const oppgaveId = useOppgaveId();

  return oppgaveId === skipToken ? 'unknown' : oppgaveId;
};
