import { Box, Button, Modal, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { styled } from 'styled-components';
import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { BEHANDLING_PANEL_DOMAIN } from '@app/components/behandling/behandlingsdetaljer/gosys/domain';
import { Entry } from '@app/components/behandling/behandlingsdetaljer/gosys/entry';
import { GosysBeskrivelseFormat } from '@app/components/behandling/behandlingsdetaljer/gosys/format-enum';
import { ModalContent } from '@app/components/behandling/behandlingsdetaljer/gosys/modal-content';
import { splitBeskrivelse } from '@app/components/behandling/behandlingsdetaljer/gosys/split-beskrivelse';
import { StyledEntryList } from '@app/components/behandling/behandlingsdetaljer/gosys/styled-entry-list';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGosysBeskrivelseTab } from '@app/hooks/settings/use-setting';
import { pushEvent, pushLog } from '@app/observability';

interface Props {
  oppgavebeskrivelse: string | null;
}

export const GosysBeskrivelse = ({ oppgavebeskrivelse }: Props) => {
  const oppgaveId = useOppgaveIdString();
  const modalRef = useRef<HTMLDialogElement>(null);
  const trimmedBeskrivelse = useMemo(
    () => (oppgavebeskrivelse === null ? '' : oppgavebeskrivelse.trim()),
    [oppgavebeskrivelse],
  );
  const expectedEntries = trimmedBeskrivelse.split('\n').filter((l) => l.includes('---')).length;
  const entries = useMemo(
    () => (trimmedBeskrivelse === null ? [] : splitBeskrivelse(trimmedBeskrivelse)),
    [trimmedBeskrivelse],
  );
  const preferredFormat = usePreferredFormat();

  const onOpenClick = useCallback(() => {
    modalRef.current?.showModal();
    pushEvent('open-gosys-description', BEHANDLING_PANEL_DOMAIN, {
      format: preferredFormat,
      expectedEntries: expectedEntries.toString(10),
      actualEntries: entries.length.toString(10),
      oppgaveId,
    });
  }, [entries.length, expectedEntries, oppgaveId, preferredFormat]);

  const hasExpectedEntries = entries.length === expectedEntries;

  useEffect(() => {
    if (!hasExpectedEntries) {
      const context = {
        expectedEntries: expectedEntries.toString(10),
        actualEntries: entries.length.toString(10),
        oppgaveId,
      };
      pushLog('Unexpected number of entries in Gosys description', { context });
      pushEvent('unexpected-gosys-description', BEHANDLING_PANEL_DOMAIN, context);
    }
  }, [entries.length, expectedEntries, hasExpectedEntries, oppgaveId]);

  if (trimmedBeskrivelse === null || trimmedBeskrivelse.length === 0) {
    return null;
  }

  const [firstEntry, secondEntry] = entries;
  const showKabalFormat =
    hasExpectedEntries && firstEntry !== undefined && preferredFormat === GosysBeskrivelseFormat.KABAL;

  return (
    <BehandlingSection label="Beskrivelse fra Gosys">
      <VStack gap="2">
        {showKabalFormat ? (
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
        ) : (
          <FadeOut $height={150} $fadeStart={50}>
            <Box as="p" background="surface-subtle" padding="2" borderRadius="medium" margin="0">
              {trimmedBeskrivelse}
            </Box>
          </FadeOut>
        )}

        <Button variant="tertiary" size="small" onClick={onOpenClick}>
          Vis alle ({entries.length})
        </Button>
      </VStack>

      <Modal
        width={600}
        header={{ heading: 'Beskrivelse fra Gosys', closeButton: true }}
        ref={modalRef}
        closeOnBackdropClick
      >
        <Modal.Body style={{ height: '80vh', overflow: 'hidden' }}>
          <ModalContent
            defaultFormat={preferredFormat}
            beskrivelse={trimmedBeskrivelse}
            entries={entries}
            gosysEntries={expectedEntries}
            hasExpectedEntries={hasExpectedEntries}
          />
        </Modal.Body>
      </Modal>
    </BehandlingSection>
  );
};

const usePreferredFormat = () => {
  const { value } = useGosysBeskrivelseTab();

  return value !== GosysBeskrivelseFormat.GOSYS ? GosysBeskrivelseFormat.KABAL : GosysBeskrivelseFormat.GOSYS;
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
