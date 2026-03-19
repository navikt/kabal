import { Box, Heading, HGrid, HStack, Modal } from '@navikt/ds-react';
import { Keyboard } from '@styled-icons/fluentui-system-regular/Keyboard';
import { useCallback, useEffect, useId, useRef } from 'react';
import {
  closePanelKeyboardHelpModal,
  useIsPanelKeyboardHelpModalOpen,
} from '@/components/oppgavebehandling-controls/keyboard-help/state';
import { isMetaKey, KEY_ICONS, Keys, MOD_KEY } from '@/keys';
import { pushEvent } from '@/observability';

export const PanelKeyboardHelpModal = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const isOpen = useIsPanelKeyboardHelpModalOpen();
  const modalHeadingId = useId();

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
      pushEvent('panel-keyboard-shortcut-help-open', 'panel-keyboard-shortcuts');
    } else {
      ref.current?.close();
    }
  }, [isOpen]);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (isMetaKey(event) && event.key === Keys.H) {
      event.preventDefault();
      event.stopPropagation();
      ref.current?.close();
    }
  }, []);

  return (
    <Modal
      ref={ref}
      closeOnBackdropClick
      aria-labelledby={modalHeadingId}
      width={780}
      onKeyDown={onKeyDown}
      onClose={closePanelKeyboardHelpModal}
    >
      <Modal.Header closeButton>
        <HStack as={Heading} gap="space-4" align="center" level="1" size="small">
          <Keyboard size={24} aria-hidden />

          <span id={modalHeadingId}>Tastaturstyring for paneler</span>
        </HStack>
      </Modal.Header>

      <Modal.Body>
        <HGrid as="dl" gap="space-4 space-8" columns="min-content 1fr">
          <ShortcutHeading>Navigere mellom paneler</ShortcutHeading>

          <Shortcut keys={[[Keys.Ctrl, Keys.Period]]}>Neste panel</Shortcut>
          <Shortcut keys={[[Keys.Ctrl, Keys.Comma]]}>Forrige panel</Shortcut>

          <ShortcutHeading>Navigere mellom elementer</ShortcutHeading>

          <Shortcut keys={[[Keys.Tab]]}>Neste fokuserbare element</Shortcut>
          <Shortcut keys={[[Keys.Shift, Keys.Tab]]}>Forrige fokuserbare element</Shortcut>

          <ShortcutHeading>Gå direkte til panel</ShortcutHeading>

          <DirectPanelShortcut number="1">Journalførte dokumenter</DirectPanelShortcut>
          <DirectPanelShortcut number="2">Dokumentvisning</DirectPanelShortcut>
          <DirectPanelShortcut number="3">Brevutforming</DirectPanelShortcut>
          <DirectPanelShortcut number="4">Behandling</DirectPanelShortcut>
          <DirectPanelShortcut number="5">Behandlingsdialog</DirectPanelShortcut>
          <DirectPanelShortcut number="6">Kvalitetsvurdering</DirectPanelShortcut>

          <ShortcutHeading>Hjelp</ShortcutHeading>

          <Shortcut keys={[[MOD_KEY, Keys.H]]}>
            Vis/skjul <H>h</H>jelp (denne oversikten over <H>h</H>urtigtaster)
          </Shortcut>
        </HGrid>
      </Modal.Body>
    </Modal>
  );
};

const H = ({ children }: { children: string }) => <strong className="underline">{children}</strong>;

interface ShortcutProps {
  keys: Keys[][];
  children: React.ReactNode;
}

const Shortcut = ({ keys, children: description }: ShortcutProps) => (
  <>
    <HStack as="dt" gap="space-4" wrap={false} align="center" justify="end" className="text-sm">
      {keys.map((combo) => (
        <HStack
          gap="space-4"
          align="center"
          wrap={false}
          key={combo.join('+')}
          className='not-last:after:content-["eller"]'
        >
          {combo.map((k) => (
            <KeyBox key={k}>{KEY_ICONS[k]}</KeyBox>
          ))}
        </HStack>
      ))}
    </HStack>

    <HStack as="dd" align="center" className="whitespace-pre">
      {description}
    </HStack>
  </>
);

interface DirectPanelShortcutProps {
  number: string;
  children: React.ReactNode;
}

const DirectPanelShortcut = ({ number, children }: DirectPanelShortcutProps) => (
  <>
    <HStack as="dt" gap="space-4" wrap={false} align="center" justify="end" className="text-sm">
      <HStack gap="space-4" align="center" wrap={false}>
        <KeyBox>{KEY_ICONS[Keys.Ctrl]}</KeyBox>
        <KeyBox>{number}</KeyBox>
      </HStack>
    </HStack>

    <HStack as="dd" align="center" className="whitespace-pre">
      {children}
    </HStack>
  </>
);

const KeyBox = ({ children }: { children: React.ReactNode }) => (
  <Box
    paddingInline="space-4"
    paddingBlock="space-2"
    background="sunken"
    borderRadius="4"
    minWidth="24px"
    minHeight="24px"
    className="flex items-center justify-center"
  >
    {children}
  </Box>
);

const ShortcutHeading = ({ children }: { children: React.ReactNode }) => (
  <Heading level="2" size="small" spacing className="col-span-1 col-start-2 not-first:mt-4">
    {children}
  </Heading>
);
