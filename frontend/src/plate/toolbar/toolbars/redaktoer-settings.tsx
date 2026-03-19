import { CogIcon } from '@navikt/aksel-icons';
import { Heading, HStack, Modal, VStack } from '@navikt/ds-react';
import { useId, useRef, useState } from 'react';
import { AbbreviationsContent, AbbreviationsHeadingContent } from '@/components/settings/abbreviations/abbreviations';
import { AbbreviationsExplanation } from '@/components/settings/abbreviations/explanation';
import { pushEvent } from '@/observability';
import { Capitalise } from '@/plate/toolbar/capitalise';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';

export const RedkatoerSettings = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const headingId = useId();

  return (
    <>
      <ToolbarIconButton
        label="Innstillinger - forkortelser"
        icon={<CogIcon aria-hidden />}
        active={isSettingsOpen}
        onClick={() => {
          pushEvent('redaktoer-open-settings', 'redaktoer');
          setIsSettingsOpen(true);
          modalRef.current?.showModal();
        }}
      />
      <Modal
        ref={modalRef}
        onClose={() => setIsSettingsOpen(false)}
        width="900px"
        aria-labelledby={headingId}
        closeOnBackdropClick
      >
        <Modal.Header>
          <Heading size="medium" level="1" id={headingId}>
            Innstillinger for brevutforming
          </Heading>
        </Modal.Header>

        <VStack asChild gap="space-16">
          <Modal.Body>
            <Capitalise />

            <section>
              <HStack asChild gap="space-8" align="center">
                <Heading level="2" size="small" spacing>
                  <AbbreviationsHeadingContent />
                </Heading>
              </HStack>

              <AbbreviationsExplanation />

              <AbbreviationsContent headingSize="xsmall" />
            </section>
          </Modal.Body>
        </VStack>
      </Modal>
    </>
  );
};
