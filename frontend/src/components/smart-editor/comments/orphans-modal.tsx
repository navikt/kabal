import { LinkBrokenIcon } from '@navikt/aksel-icons';
import { Button, Dialog, HStack, Tooltip } from '@navikt/ds-react';
import { Alert } from '@/components/alert/alert';
import { THREAD_WIDTH, Thread } from '@/components/smart-editor/comments/thread';
import { useThreads } from '@/components/smart-editor/comments/use-threads';

const ORPHAN_HELP_TEXT = 'Teksten som kommentarene var knyttet til finnes ikke lenger i dokumentet.';

const GAP = 4;
const MODAL_PADDING = 24;

export const OrphansModal = () => {
  const { orphans } = useThreads();

  const orphansCount = orphans.length;
  const modalWidth = Math.min(orphansCount * (THREAD_WIDTH + GAP * 4) - GAP * 4 + MODAL_PADDING * 2, window.innerWidth);

  return (
    <Dialog>
      <Tooltip content={ORPHAN_HELP_TEXT}>
        <Dialog.Trigger>
          <Button data-color="neutral" variant="tertiary" size="xsmall">
            <HStack as="span" align="center" wrap={false}>
              ({orphansCount} <LinkBrokenIcon aria-hidden />)
            </HStack>
          </Button>
        </Dialog.Trigger>
      </Tooltip>
      <Dialog.Popup width={`${modalWidth}px`}>
        <Dialog.Header>
          <Dialog.Title>Andre kommentarer</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Alert variant="info">{ORPHAN_HELP_TEXT}</Alert>
          <HStack as="section" wrap align="start" gap="space-16" marginBlock="space-16 space-0">
            {orphans.map((o) => (
              <Thread key={o.id} thread={o} isFocused zIndex={0} />
            ))}
          </HStack>
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  );
};
