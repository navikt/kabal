import { Box, Button, Modal, VStack } from '@navikt/ds-react';
import { useMemo, useRef } from 'react';
import { styled } from 'styled-components';
import { BehandlingSection } from '@app/components/behandling/behandlingsdetaljer/behandling-section';
import { Entry } from '@app/components/behandling/behandlingsdetaljer/gosys/entry';
import { GosysBeskrivelseFormat } from '@app/components/behandling/behandlingsdetaljer/gosys/format-enum';
import { ModalContent } from '@app/components/behandling/behandlingsdetaljer/gosys/modal-content';
import { splitBeskrivelse } from '@app/components/behandling/behandlingsdetaljer/gosys/split-beskrivelse';
import { StyledEntryList } from '@app/components/behandling/behandlingsdetaljer/gosys/styled-entry-list';
import { useGosysBeskrivelseTab } from '@app/hooks/settings/use-setting';

interface Props {
  oppgavebeskrivelse: string | null;
}

export const GosysBeskrivelse = ({ oppgavebeskrivelse }: Props) => {
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

  if (trimmedBeskrivelse === null || trimmedBeskrivelse.length === 0) {
    return null;
  }

  const [firstEntry, secondEntry] = entries;
  const hasEntries = firstEntry !== undefined;
  const hasExpectedEntries = hasEntries && expectedEntries === entries.length;
  const showKabalFormat = hasExpectedEntries && preferredFormat === GosysBeskrivelseFormat.KABAL;

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

        <Button variant="tertiary" size="small" onClick={() => modalRef.current?.showModal()}>
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
