import { CogIcon } from '@navikt/aksel-icons';
import { Heading, Modal, ToggleGroup } from '@navikt/ds-react';
import React, { useContext, useRef, useState } from 'react';
import { styled } from 'styled-components';
import {
  AbbreviationsContent,
  AbbreviationsHeadingContent,
} from '@app/components/settings/abbreviations/abbreviations';
import { AbbreviationsExplanation } from '@app/components/settings/abbreviations/explanation';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { pushEvent } from '@app/observability';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';

interface Props {
  showComments?: boolean;
}

export const Settings = ({ showComments = false }: Props) => {
  const { showAnnotationsAtOrigin, setShowAnnotationsAtOrigin } = useContext(SmartEditorContext);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <ToolbarIconButton
        label="Innstillinger - forkortelser, kommentarer og bokmerker"
        icon={<CogIcon aria-hidden />}
        active={isSettingsOpen}
        onClick={() => {
          pushEvent('open-settings', {}, 'smart-editor');
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
        <Modal.Body>
          {showComments ? (
            <>
              <Heading level="2" size="small" spacing>
                Kommentarer og bokmerker
              </Heading>
              <SettingsRow>
                <ToggleGroup
                  size="small"
                  defaultValue={Placement.RELATIVE}
                  value={showAnnotationsAtOrigin ? Placement.RELATIVE : Placement.COLUMN}
                  onChange={(v) => {
                    const enabled = v === Placement.RELATIVE;
                    pushEvent('toggle-show-annotations-at-origin', { enabled: enabled.toString() }, 'smart-editor');
                    setShowAnnotationsAtOrigin(enabled);
                  }}
                >
                  <ToggleGroup.Item value={Placement.RELATIVE}>
                    Vis kommentarer og bokmerker ved siden av innhold
                  </ToggleGroup.Item>
                  <ToggleGroup.Item value={Placement.COLUMN}>
                    Vis kommentarer og bokmerker sortert kronologisk
                  </ToggleGroup.Item>
                </ToggleGroup>
              </SettingsRow>
            </>
          ) : null}
          <StyledHeading level="2" size="small" spacing>
            <AbbreviationsHeadingContent />
          </StyledHeading>
          <SettingsRow>
            <AbbreviationsExplanation />
          </SettingsRow>
          <AbbreviationsContent headingSize="xsmall" />
        </Modal.Body>
      </Modal>
    </>
  );
};

enum Placement {
  RELATIVE = 'RELATIVE',
  COLUMN = 'COLUMN',
}

const SettingsRow = styled.div`
  margin-bottom: 16px;
`;

const StyledHeading = styled(Heading)`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  align-items: center;
`;
