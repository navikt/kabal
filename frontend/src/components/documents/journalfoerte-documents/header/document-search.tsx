import { useKeyboardContext } from '@app/components/documents/journalfoerte-documents/keyboard-context';
import { useHasSeenKeyboardShortcuts } from '@app/hooks/settings/use-setting';
import { MOD_KEY } from '@app/keys';
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from '@navikt/aksel-icons';
import { Box, Button, HGrid, HStack, Heading, Modal, Search } from '@navikt/ds-react';
import { Keyboard } from '@styled-icons/fluentui-system-regular/Keyboard';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { Fields } from '../grid';

interface Props {
  setSearch: (value: string) => void;
  search: string;
}

export const DocumentSearch = memo(
  ({ search, setSearch }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDialogElement>(null);
    const [value, setValue] = useState<string>(search);

    useEffect(() => {
      const timeout = setTimeout(() => {
        dispatch('document-reset', ref.current);
        setSearch(value);
      }, 200);

      return () => clearTimeout(timeout);
    }, [value, setSearch]);

    const {
      down,
      up,
      home,
      end,
      pageUp,
      pageDown,
      reset,
      focus,
      left,
      right,
      toggleVedlegg,
      toggleAllVedlegg,
      addLogiskVedlegg,
      toggleInfo,
      toggleAllInfo,
      toggleSelect,
      toggleInclude,
      rename,
      openInline,
      openNewTab,
      activeDocument,
    } = useKeyboardContext();

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      const mod = event.metaKey || event.ctrlKey;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        down();
      }

      if (mod && event.key === 'h') {
        event.preventDefault();
        modalRef.current?.showModal();
      }

      if (activeDocument === -1) {
        if (event.key === 'Escape') {
          event.preventDefault();
          setValue('');
        }

        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        mod ? home() : up();
      }

      if (event.key === 'Home' || (mod && event.key === 'ArrowUp')) {
        event.preventDefault();
        home();
      }

      if (event.key === 'End' || (mod && event.key === 'ArrowDown')) {
        event.preventDefault();
        end();
      }

      if (event.key === 'PageUp') {
        event.preventDefault();
        pageUp();
      }

      if (event.key === 'PageDown') {
        event.preventDefault();
        pageDown();
      }

      if (event.key === 'i') {
        event.preventDefault();
        mod ? toggleAllInfo() : toggleInfo();
      }

      if (event.key === 'm') {
        event.preventDefault();
        toggleInclude();
      }

      if (event.key === 'v') {
        event.preventDefault();
        mod ? toggleAllVedlegg() : toggleVedlegg();
      }

      if (event.key === 'l') {
        event.preventDefault();
        addLogiskVedlegg();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        right();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        left();
      }

      if (event.key === 'n') {
        event.preventDefault();
        rename();
      }

      if (event.key === ' ') {
        event.preventDefault();
        toggleSelect();
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        mod ? openNewTab() : openInline();
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        reset();
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        focus();
      }
    };

    const { value: hasSeenKeyboardShortcuts, setValue: setHasSeenKeyboardShortcuts } = useHasSeenKeyboardShortcuts();

    useEffect(() => {
      if (hasSeenKeyboardShortcuts) {
        return;
      }

      const timeout = setTimeout(() => {
        modalRef.current?.showModal();
        setHasSeenKeyboardShortcuts(true);
      });

      return () => clearTimeout(timeout);
    }, [hasSeenKeyboardShortcuts, setHasSeenKeyboardShortcuts]);

    return (
      <div ref={ref} style={{ gridArea: Fields.Title }}>
        <HStack align="center" gap="1" wrap={false}>
          <Search
            label="Tittel/journalpost-ID"
            hideLabel
            size="small"
            variant="simple"
            placeholder="Tittel/journalpost-ID"
            onChange={setValue}
            value={value}
            onKeyDown={onKeyDown}
            onBlur={() => reset()}
          />

          <Button
            variant="tertiary"
            size="small"
            icon={<Keyboard size={22} aria-hidden />}
            onClick={() => modalRef.current?.showModal()}
          />

          <Modal ref={modalRef} closeOnBackdropClick aria-labelledby="modal-title">
            <Modal.Header closeButton>
              <HStack as={Heading} gap="1" align="center" level="1" size="small">
                <Keyboard size={24} aria-hidden />
                <span id="modal-title">Tastaturstyring i dokumentlisten</span>
              </HStack>
            </Modal.Header>

            <Modal.Body>
              <HGrid as="dl" gap="1 2" columns="min-content 1fr">
                {KEYBOARD_HELP.map((item) => (
                  <Fragment key={item.shortcuts.map((combo) => combo.join('+')).join('|')}>
                    <HStack as="dt" gap="1" wrap={false} align="center" justify="end" className="text-sm">
                      {item.shortcuts.map((combo) => (
                        <HStack
                          gap="1"
                          align="center"
                          wrap={false}
                          key={combo.join('+')}
                          className='not-last:after:content-["eller"]'
                        >
                          {combo.map((k) => (
                            <Box
                              key={k}
                              paddingInline="1"
                              paddingBlock="05"
                              background="surface-inverted"
                              borderRadius="medium"
                              minWidth="24px"
                              minHeight="24px"
                              className="flex items-center justify-center text-(--a-text-on-inverted)"
                            >
                              {KEY_ICONS[k]}
                            </Box>
                          ))}
                        </HStack>
                      ))}
                    </HStack>

                    <HStack as="dd" align="center">
                      {item.description}
                    </HStack>
                  </Fragment>
                ))}
              </HGrid>
            </Modal.Body>
          </Modal>
        </HStack>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.search === nextProps.search && prevProps.setSearch === nextProps.setSearch,
);

DocumentSearch.displayName = 'DocumentSearch';

const dispatch = (eventName: string, element: HTMLDivElement | null) =>
  element?.dispatchEvent(new CustomEvent(eventName, { bubbles: true, cancelable: true }));

enum Keys {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  PageUp = 'PageUp',
  PageDown = 'PageDown',
  Home = 'Home',
  End = 'End',
  Escape = 'Escape',
  Space = 'Space',
  Enter = 'Enter',
  I = 'I',
  M = 'M',
  V = 'V',
  L = 'L',
  N = 'N',
  H = 'H',
  Mod = 'MOD',
  Shift = 'Shift',
}

const KEY_ICONS: Record<Keys, React.ReactNode> = {
  [Keys.ArrowUp]: <ArrowUpIcon aria-hidden />,
  [Keys.ArrowDown]: <ArrowDownIcon aria-hidden />,
  [Keys.ArrowLeft]: <ArrowLeftIcon aria-hidden />,
  [Keys.ArrowRight]: <ArrowRightIcon aria-hidden />,
  [Keys.PageUp]: 'PgUp',
  [Keys.PageDown]: 'PgDn',
  [Keys.Home]: 'Home',
  [Keys.End]: 'End',
  [Keys.Escape]: 'Esc',
  [Keys.Space]: 'Space',
  [Keys.Enter]: 'Enter',
  [Keys.I]: 'I',
  [Keys.M]: 'M',
  [Keys.V]: 'V',
  [Keys.L]: 'L',
  [Keys.N]: 'N',
  [Keys.H]: 'H',
  [Keys.Mod]: MOD_KEY,
  [Keys.Shift]: 'Shift',
};

interface KeyboardShortcut {
  description: string;
  shortcuts: Keys[][];
}

const KEYBOARD_HELP: KeyboardShortcut[] = [
  { shortcuts: [[Keys.ArrowUp], [Keys.ArrowDown]], description: 'Naviger mellom dokumenter.' },
  { shortcuts: [[Keys.ArrowLeft], [Keys.ArrowRight]], description: 'Vis/skjul vedlegg.' },
  { shortcuts: [[Keys.Mod, Keys.ArrowUp], [Keys.Home]], description: 'Gå til første dokument eller vedlegg.' },
  { shortcuts: [[Keys.Mod, Keys.ArrowDown], [Keys.End]], description: 'Gå til siste dokument eller vedlegg.' },
  { shortcuts: [[Keys.PageUp], [Keys.PageDown]], description: 'Naviger mellom dokumenter, 10 av gangen.' },
  { shortcuts: [[Keys.I]], description: 'Vis/skjul info.' },
  { shortcuts: [[Keys.Mod, Keys.I]], description: 'Vis/skjul info (alle dokumenter og vedlegg).' },
  { shortcuts: [[Keys.M]], description: 'Inkluder i klage.' },
  { shortcuts: [[Keys.V]], description: 'Vis/skjul vedlegg.' },
  { shortcuts: [[Keys.L]], description: 'Legg til logisk vedlegg.' },
  { shortcuts: [[Keys.Mod, Keys.V]], description: 'Vis/skjul vedlegg (alle dokumenter og vedlegg).' },
  { shortcuts: [[Keys.N]], description: 'Endre navn.' },
  { shortcuts: [[Keys.Enter]], description: 'Åpne dokument.' },
  { shortcuts: [[Keys.Mod, Keys.Enter]], description: 'Åpne dokument i ny fane.' },
  { shortcuts: [[Keys.Space]], description: 'Legg til/fjern fra valgte dokumenter.' },
  { shortcuts: [[Keys.Escape]], description: 'Avslutt tasteturstyring.' },
  { shortcuts: [[Keys.Mod, Keys.H]], description: 'Vis hurtigtaster. Denne oversikten.' },
];
