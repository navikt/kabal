import { THREAD_WIDTH, Thread } from '@app/components/smart-editor/comments/thread';
import { useThreads } from '@app/components/smart-editor/comments/use-threads';
import { LinkBrokenIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, HStack, Modal, Tooltip } from '@navikt/ds-react';
import { useId, useRef } from 'react';

const ORPHAN_HELP_TEXT = 'Teksten som kommentarene var knyttet til finnes ikke lenger i dokumentet.';

const GAP = 4;
const MODAL_PADDING = 24;

export const OrphansModal = () => {
  const { orphans } = useThreads();
  const modalRef = useRef<HTMLDialogElement>(null);
  const headerId = useId();

  const orphansCount = orphans.length;
  const modalWidth = Math.min(orphansCount * (THREAD_WIDTH + GAP * 4) - GAP * 4 + MODAL_PADDING * 2, window.innerWidth);

  return (
    <>
      <Tooltip content={ORPHAN_HELP_TEXT}>
        <Button variant="tertiary" size="xsmall" onClick={() => modalRef.current?.showModal()}>
          <HStack as="span" align="center" wrap={false}>
            ({orphansCount} <LinkBrokenIcon aria-hidden />)
          </HStack>
        </Button>
      </Tooltip>
      <Modal ref={modalRef} closeOnBackdropClick width={modalWidth} aria-labelledby={headerId}>
        <Modal.Header id={headerId} closeButton>
          <Heading level="1" size="small">
            Andre kommentarer
          </Heading>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info" size="small">
            {ORPHAN_HELP_TEXT}
          </Alert>
          <HStack as="section" wrap align="start" gap="4" marginBlock="4 0">
            {orphans.map((o) => (
              <Thread key={o.id} thread={o} isExpanded zIndex={0} />
            ))}
          </HStack>
        </Modal.Body>
      </Modal>
    </>
  );
};
