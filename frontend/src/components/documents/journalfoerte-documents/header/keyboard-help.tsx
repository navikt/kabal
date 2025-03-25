import { useHasSeenKeyboardShortcuts } from '@app/hooks/settings/use-setting';
import { KEY_ICONS, Keys, MOD_KEY, isMetaKey } from '@app/keys';
import { pushEvent } from '@app/observability';
import { Box, Button, HGrid, HStack, Heading, Modal } from '@navikt/ds-react';
import { Keyboard } from '@styled-icons/fluentui-system-regular/Keyboard';
import { useCallback } from 'react';

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
  showModal: () => void;
}

const PING_ANIMATION_CLASSES =
  'relative after:absolute after:top-1.5 after:left-0 after:right-0 after:bottom-1 after:animate-ping motion-reduce:after:animate-ping after:rounded-medium after:border-2 after:border-border-action';
const WIGGLE_ANIMATION_CLASSES = 'animate-wiggle motion-reduce:animate-wiggle';
const BOUCE_ANIMATION_CLASSES = 'animate-bounce motion-reduce:animate-bounce';
const ANIMATIONS = [PING_ANIMATION_CLASSES, WIGGLE_ANIMATION_CLASSES, BOUCE_ANIMATION_CLASSES];
const ANIMATIONS_COUNT = ANIMATIONS.length;

const randomAnimationIndex = Math.floor(Math.random() * ANIMATIONS_COUNT);
const getRandomAnimation = () => ANIMATIONS[randomAnimationIndex];

export const KeyboardHelp = ({ ref, showModal }: Props) => {
  const { value: hasSeenKeyboardShortcuts } = useHasSeenKeyboardShortcuts();

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isMetaKey(event) && event.key === Keys.H) {
        event.preventDefault();
        event.stopPropagation();
        ref.current?.close();
      }
    },
    [ref],
  );

  return (
    <>
      <Button
        variant="tertiary"
        size="small"
        icon={
          <span className={hasSeenKeyboardShortcuts ? undefined : getRandomAnimation()}>
            <Keyboard size={22} aria-hidden />
          </span>
        }
        onClick={() => {
          showModal();
          pushEvent('keyboard-shortcut-help-button-open', 'journalforte-documents-keyboard-shortcuts');
        }}
      />

      <Modal ref={ref} closeOnBackdropClick aria-labelledby="kb-help-modal-title" width={720} onKeyDown={onKeyDown}>
        <Modal.Header closeButton>
          <HStack as={Heading} gap="1" align="center" level="1" size="small">
            <Keyboard size={24} aria-hidden />

            <span id="kb-help-modal-title">Tastaturstyring i journalførte dokumenter</span>
          </HStack>
        </Modal.Header>

        <Modal.Body>
          <HGrid as="dl" gap="1 2" columns="min-content 1fr">
            <ShortcutHeading>Grunnleggende</ShortcutHeading>

            <Shortcut keys={[[Keys.ArrowUp], [Keys.ArrowDown]]}>Naviger mellom dokumenter og vedlegg</Shortcut>
            <Shortcut keys={[[Keys.ArrowLeft], [Keys.ArrowRight]]}>Vis/skjul vedlegg</Shortcut>
            <Shortcut keys={[[Keys.Enter]]}>Åpne/lukk valgt(e) dokument(er)</Shortcut>
            <Shortcut keys={[[MOD_KEY, Keys.Enter]]}>Åpne valgt(e) dokument(er) i ny fane</Shortcut>
            <Shortcut keys={[[Keys.Space]]}>Velg/avvelg dokument eller vedlegg</Shortcut>
            <Shortcut keys={[[Keys.Escape]]}>Avslutt tastaturstyring</Shortcut>

            <ShortcutHeading>Avansert</ShortcutHeading>

            <Shortcut keys={[[MOD_KEY, Keys.ArrowUp], [Keys.Home]]}>Gå til første dokument eller vedlegg</Shortcut>
            <Shortcut keys={[[MOD_KEY, Keys.ArrowDown], [Keys.End]]}>Gå til siste dokument eller vedlegg</Shortcut>

            <Shortcut keys={[[MOD_KEY, Keys.ArrowLeft]]}>Skjul vedlegg for alle dokumenter</Shortcut>
            <Shortcut keys={[[MOD_KEY, Keys.ArrowRight]]}>Vis vedlegg for alle dokumenter</Shortcut>

            <Shortcut keys={[[Keys.D]]}>
              Inkluder/ekskluder <H>d</H>okument i/fra saken
            </Shortcut>
            <Shortcut keys={[[MOD_KEY, Keys.D]]}>
              Vis bare <H>d</H>okumenter inkludert i saken
            </Shortcut>
            <Shortcut keys={[[Keys.I]]}>
              Vis/skjul <H>i</H>nformasjon for dokument
            </Shortcut>
            <Shortcut keys={[[Keys.V]]}>
              Bruk som <H>v</H>edlegg til dokument under arbeid
            </Shortcut>
            <Shortcut keys={[[Keys.N]]}>
              Endre <H>n</H>avn
            </Shortcut>

            <Shortcut
              keys={[
                [Keys.Shift, Keys.ArrowUp],
                [Keys.Shift, Keys.ArrowDown],
              ]}
            >
              Velg flere dokumenter og vedlegg
            </Shortcut>
            <Shortcut
              keys={[
                [Keys.Shift, Keys.Home],
                [MOD_KEY, Keys.Shift, Keys.ArrowUp],
              ]}
            >
              Velg alle dokumenter/vedlegg oppover
            </Shortcut>
            <Shortcut
              keys={[
                [Keys.Shift, Keys.End],
                [MOD_KEY, Keys.Shift, Keys.ArrowDown],
              ]}
            >
              Velg alle dokumenter/vedlegg nedover
            </Shortcut>
            <Shortcut
              keys={[
                [Keys.Shift, Keys.Space],
                [MOD_KEY, Keys.Space],
                [MOD_KEY, Keys.A],
              ]}
            >
              Velg/avvelg alle dokumenter og vedlegg
            </Shortcut>

            <ShortcutHeading>Hjelp</ShortcutHeading>

            <Shortcut keys={[[MOD_KEY, Keys.H]]}>
              Vis/skjul <H>h</H>jelp (denne oversikten over <H>h</H>urtigtaster)
            </Shortcut>
          </HGrid>
        </Modal.Body>
      </Modal>
    </>
  );
};

const H = ({ children }: { children: string }) => <strong className="underline">{children}</strong>;

interface ShortcutProps {
  keys: Keys[][];
  children: React.ReactNode;
}

const Shortcut = ({ keys, children: description }: ShortcutProps) => (
  <>
    <HStack as="dt" gap="1" wrap={false} align="center" justify="end" className="text-sm">
      {keys.map((combo) => (
        <HStack gap="1" align="center" wrap={false} key={combo.join('+')} className='not-last:after:content-["eller"]'>
          {combo.map((k) => (
            <Box
              key={k}
              paddingInline="1"
              paddingBlock="05"
              background="surface-inverted"
              borderRadius="medium"
              minWidth="24px"
              minHeight="24px"
              className="flex items-center justify-center text-text-on-inverted"
            >
              {KEY_ICONS[k]}
            </Box>
          ))}
        </HStack>
      ))}
    </HStack>

    <HStack as="dd" align="center" className="whitespace-pre">
      {description}
    </HStack>
  </>
);

const ShortcutHeading = ({ children }: { children: React.ReactNode }) => (
  <Heading level="2" size="small" spacing className="col-span-1 col-start-2 not-first:mt-4">
    {children}
  </Heading>
);
