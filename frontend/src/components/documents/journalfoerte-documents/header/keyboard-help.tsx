import { Keys, MOD_KEY_ENUM } from '@app/components/documents/journalfoerte-documents/header/keys';
import { CMD, CTRL } from '@app/keys';
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from '@navikt/aksel-icons';
import { Box, Button, HGrid, HStack, Heading, Modal } from '@navikt/ds-react';
import { Keyboard } from '@styled-icons/fluentui-system-regular/Keyboard';

interface Props {
  ref: React.Ref<HTMLDialogElement>;
}

export const KeyboardHelp = ({ ref }: Props) => {
  return (
    <>
      <Button
        variant="tertiary"
        size="small"
        icon={<Keyboard size={22} aria-hidden />}
        onClick={() => {
          // TODO: Fix this to use the ref passed in as a prop. Open modal.
        }}
      />

      <Modal ref={ref} closeOnBackdropClick aria-labelledby="modal-title" width={720}>
        <Modal.Header closeButton>
          <HStack as={Heading} gap="1" align="center" level="1" size="small">
            <Keyboard size={24} aria-hidden />
            <span id="modal-title">Tastaturstyring i dokumentlisten</span>
          </HStack>
        </Modal.Header>

        <Modal.Body>
          <HGrid as="dl" gap="1 2" columns="min-content 1fr">
            <ShortcutHeading>Grunnleggende</ShortcutHeading>

            <Shortcut keys={[[Keys.ArrowUp], [Keys.ArrowDown]]}>Naviger mellom dokumenter og vedlegg.</Shortcut>
            <Shortcut keys={[[Keys.ArrowLeft], [Keys.ArrowRight]]}>Vis/skjul vedlegg.</Shortcut>
            <Shortcut keys={[[Keys.Enter]]}>Åpne/lukk valgt(e) dokument(er).</Shortcut>
            <Shortcut keys={[[MOD_KEY_ENUM, Keys.Enter]]}>Åpne valgt(e) dokument(er) i ny fane.</Shortcut>
            <Shortcut keys={[[Keys.Escape]]}>
              1. Avvelg alle dokumenter. 2. Lukk åpent dokument. 3. Avslutt tastaturstyring.
            </Shortcut>

            <ShortcutHeading>Navigering</ShortcutHeading>

            <Shortcut keys={[[MOD_KEY_ENUM, Keys.ArrowLeft]]}>Skjul vedlegg for alle dokumenter.</Shortcut>
            <Shortcut keys={[[MOD_KEY_ENUM, Keys.ArrowRight]]}>Vis vedlegg for alle dokumenter.</Shortcut>
            <Shortcut keys={[[MOD_KEY_ENUM, Keys.ArrowUp], [Keys.Home]]}>
              Gå til første dokument eller vedlegg.
            </Shortcut>
            <Shortcut keys={[[MOD_KEY_ENUM, Keys.ArrowDown], [Keys.End]]}>
              Gå til siste dokument eller vedlegg.
            </Shortcut>
            <Shortcut keys={[[Keys.Alt, Keys.ArrowUp], [Keys.PageUp]]}>Naviger en side opp.</Shortcut>
            <Shortcut keys={[[Keys.Alt, Keys.ArrowDown], [Keys.PageDown]]}>Naviger en side ned.</Shortcut>

            <ShortcutHeading>Handlinger</ShortcutHeading>

            <Shortcut keys={[[Keys.M]]}>Inkluder i sak.</Shortcut>
            <Shortcut keys={[[MOD_KEY_ENUM, Keys.M]]}>Vis bare dokumenter inkludert i saken.</Shortcut>
            <Shortcut keys={[[Keys.I]]}>Vis/skjul info for dokument.</Shortcut>
            <Shortcut keys={[[Keys.V]]}>Bruk som vedlegg til dokument under arbeid.</Shortcut>
            <Shortcut keys={[[Keys.N]]}>Endre navn.</Shortcut>

            <ShortcutHeading>Velge dokumenter</ShortcutHeading>

            <Shortcut keys={[[Keys.Space]]}>Velg/avvelg dokument eller vedlegg.</Shortcut>
            <Shortcut
              keys={[
                [MOD_KEY_ENUM, Keys.Space],
                [MOD_KEY_ENUM, Keys.A],
              ]}
            >
              Velg/avvelg alle dokumenter og vedlegg.
            </Shortcut>
            <Shortcut
              keys={[
                [Keys.Shift, Keys.ArrowUp],
                [Keys.Shift, Keys.ArrowDown],
              ]}
            >
              Velg flere dokumenter og vedlegg.
            </Shortcut>

            <ShortcutHeading>Hjelp</ShortcutHeading>

            <Shortcut keys={[[MOD_KEY_ENUM, Keys.H]]}>Vis hurtigtaster. Denne oversikten.</Shortcut>
          </HGrid>
        </Modal.Body>
      </Modal>
    </>
  );
};

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
              className="flex items-center justify-center text-(--a-text-on-inverted)"
            >
              {KEY_ICONS[k]}
            </Box>
          ))}
        </HStack>
      ))}
    </HStack>

    <HStack as="dd" align="center">
      {description}
    </HStack>
  </>
);

const ShortcutHeading = ({ children }: { children: React.ReactNode }) => (
  <Heading level="2" size="small" spacing className="col-span-2 not-first:mt-4 text-center">
    {children}
  </Heading>
);

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
  [Keys.A]: 'A',
  [Keys.Ctrl]: CTRL,
  [Keys.Cmd]: CMD,
  [Keys.Shift]: 'Shift',
  [Keys.Alt]: 'Alt',
};
