import {
  AbbreviationsContent,
  AbbreviationsHeadingContent,
} from '@app/components/settings/abbreviations/abbreviations';
import { AbbreviationsExplanation } from '@app/components/settings/abbreviations/explanation';
import { pushEvent } from '@app/observability';
import { Capitalise } from '@app/plate/toolbar/capitalise';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { CogIcon } from '@navikt/aksel-icons';
import { Heading, Modal } from '@navikt/ds-react';
import { useId, useRef, useState } from 'react';
import { styled } from 'styled-components';

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
        <StyledModalBody>
          <Capitalise />

          <section>
            <StyledHeading level="2" size="small" spacing>
              <AbbreviationsHeadingContent />
            </StyledHeading>

            <AbbreviationsExplanation />

            <AbbreviationsContent headingSize="xsmall" />
          </section>
        </StyledModalBody>
      </Modal>
    </>
  );
};

const StyledModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-4);
`;

const StyledHeading = styled(Heading)`
  display: flex;
  flex-direction: row;
  column-gap: var(--a-spacing-2);
  align-items: center;
`;
