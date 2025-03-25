import { KEY_ICONS, Keys, MOD_KEY, isMetaKey } from '@app/keys';
import { Box, HGrid, HStack, Heading, Modal } from '@navikt/ds-react';
import { Keyboard } from '@styled-icons/fluentui-system-regular/Keyboard';
import { useCallback } from 'react';

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
}

export const KeyboardHelpModal = ({ ref }: Props) => {
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

          <ShortcutHeading>Avansert</ShortcutHeading>

          <Shortcut keys={[[Keys.Escape]]}>Tøm filter for dokumentnavn</Shortcut>

          <Shortcut keys={[[MOD_KEY, Keys.ArrowUp], [Keys.Home]]}>Gå til første dokument eller vedlegg</Shortcut>
          <Shortcut keys={[[MOD_KEY, Keys.ArrowDown], [Keys.End]]}>Gå til siste dokument eller vedlegg</Shortcut>

          <Shortcut keys={[[MOD_KEY, Keys.ArrowLeft]]}>Skjul vedlegg for alle dokumenter</Shortcut>
          <Shortcut keys={[[MOD_KEY, Keys.ArrowRight]]}>Vis vedlegg for alle dokumenter</Shortcut>

          <Shortcut keys={[[MOD_KEY, Keys.D]]}>
            Inkluder/ekskluder <H>d</H>okument i/fra saken
          </Shortcut>
          <Shortcut keys={[[MOD_KEY, Keys.Shift, Keys.D]]}>
            Vis bare <H>d</H>okumenter inkludert i saken
          </Shortcut>
          <Shortcut keys={[[MOD_KEY, Keys.I]]}>
            Vis/skjul <H>i</H>nformasjon for dokument
          </Shortcut>
          <Shortcut keys={[[MOD_KEY, Keys.V]]}>
            Bruk som <H>v</H>edlegg til dokument under arbeid
          </Shortcut>
          <Shortcut keys={[[MOD_KEY, Keys.N]]}>
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
