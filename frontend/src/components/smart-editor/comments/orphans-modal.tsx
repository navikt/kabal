import { LinkBrokenIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, Modal, Tooltip } from '@navikt/ds-react';
import React, { useRef } from 'react';
import { styled } from 'styled-components';
import { THREAD_WIDTH, Thread } from '@app/components/smart-editor/comments/thread';
import { useThreads } from '@app/components/smart-editor/comments/use-threads';

const ORPHAN_HELP_TEXT = 'Teksten som kommentarene var knyttet til finnes ikke lenger i dokumentet.';

const GAP = 16;
const MODAL_PADDING = 24;

export const OrphansModal = () => {
  const { orphans } = useThreads();
  const modalRef = useRef<HTMLDialogElement>(null);

  const orphansCount = orphans.length;
  const modalWidth = Math.min(orphansCount * (THREAD_WIDTH + GAP) - GAP + MODAL_PADDING * 2, window.innerWidth);

  return (
    <>
      <Tooltip content={ORPHAN_HELP_TEXT}>
        <Button variant="tertiary" size="xsmall" onClick={() => modalRef.current?.showModal()}>
          <ButtonContent>
            ({orphansCount} <LinkBrokenIcon aria-hidden />)
          </ButtonContent>
        </Button>
      </Tooltip>
      <Modal ref={modalRef} closeOnBackdropClick width={modalWidth} aria-labelledby="modal-header">
        <Modal.Header id="modal-header" closeButton>
          <Heading level="1" size="small">
            Andre kommentarer
          </Heading>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info" size="small">
            {ORPHAN_HELP_TEXT}
          </Alert>
          <OrphansContainer>
            {orphans.map((o) => (
              <Thread key={o.id} thread={o} isExpanded />
            ))}
          </OrphansContainer>
        </Modal.Body>
      </Modal>
    </>
  );
};

const OrphansContainer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  column-gap: ${GAP}px;
  row-gap: ${GAP}px;
  margin-top: ${GAP}px;
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
`;
