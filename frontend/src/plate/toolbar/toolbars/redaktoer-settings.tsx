import { CogIcon } from '@navikt/aksel-icons';
import { Heading, Modal } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import {
  AbbreviationsContent,
  AbbreviationsHeadingContent,
} from '@app/components/settings/abbreviations/abbreviations';
import { AbbreviationsExplanation } from '@app/components/settings/abbreviations/explanation';
import { pushEvent } from '@app/observability';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';

export const RedkatoerSettings = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <ToolbarIconButton
        label="Innstillinger - forkortelser"
        icon={<CogIcon aria-hidden />}
        active={isSettingsOpen}
        onClick={() => {
          pushEvent('redaktoer-open-settings', {}, 'redaktoer');
          setIsSettingsOpen(true);
          modalRef.current?.showModal();
        }}
      />
      <Modal
        ref={modalRef}
        onClose={() => setIsSettingsOpen(false)}
        width="900px"
        aria-labelledby="modal-heading"
        closeOnBackdropClick
      >
        <Modal.Header>
          <Heading size="medium" level="1" id="modal-heading">
            Innstillinger for brevutforming
          </Heading>
        </Modal.Header>
        <StyledModalBody>
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
  row-gap: 16px;
`;

const StyledHeading = styled(Heading)`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  align-items: center;
`;
