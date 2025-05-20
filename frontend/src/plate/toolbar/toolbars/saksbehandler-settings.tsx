import {
  AbbreviationsContent,
  AbbreviationsHeadingContent,
} from '@app/components/settings/abbreviations/abbreviations';
import { AbbreviationsExplanation } from '@app/components/settings/abbreviations/explanation';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useSmartEditorExpandedThreads } from '@app/hooks/settings/use-setting';
import { useSetSmartEditorLanguage } from '@app/hooks/use-set-smart-editor-language';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { pushEvent } from '@app/observability';
import { Capitalise } from '@app/plate/toolbar/capitalise';
import { ToolbarIconButton } from '@app/plate/toolbar/toolbarbutton';
import { Language, isLanguage } from '@app/types/texts/language';
import { CogIcon } from '@navikt/aksel-icons';
import { Heading, Modal, ToggleGroup, VStack } from '@navikt/ds-react';
import { useCallback, useContext, useRef, useState } from 'react';
import { styled } from 'styled-components';

export const SaksbehandlerSettings = () => {
  const { hasWriteAccess, showAnnotationsAtOrigin, setShowAnnotationsAtOrigin } = useContext(SmartEditorContext);
  const { value: expandedThreads = true, setValue: setExpandedThreads } = useSmartEditorExpandedThreads();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const language = useSmartEditorLanguage();
  const [setLanguage] = useSetSmartEditorLanguage();

  const onChangeLanguage = useCallback(
    (lang: string) => {
      const newLang = isLanguage(lang) ? lang : Language.NB;
      setLanguage(newLang);
      pushEvent('change-document-language', 'smart-editor', { language: newLang });
    },
    [setLanguage],
  );

  return (
    <>
      <ToolbarIconButton
        label="Innstillinger - språk, forkortelser, kommentarer og bokmerker"
        icon={<CogIcon aria-hidden />}
        active={isSettingsOpen}
        onClick={() => {
          pushEvent('open-settings', 'smart-editor');
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
          {hasWriteAccess ? (
            <section aria-labelledby="set-language">
              <Heading level="2" size="small" spacing id="set-language">
                Språk
              </Heading>
              <ToggleGroup size="small" value={language} onChange={onChangeLanguage}>
                <ToggleGroup.Item value={Language.NB}>Bokmål</ToggleGroup.Item>
                <ToggleGroup.Item value={Language.NN}>Nynorsk</ToggleGroup.Item>
              </ToggleGroup>
            </section>
          ) : null}

          <Capitalise />

          <section aria-labelledby="set-comments-and-bookmarks">
            <Heading level="2" size="small" spacing id="set-comments-and-bookmarks">
              Kommentarer og bokmerker
            </Heading>

            <VStack gap="3">
              <ToggleGroup
                size="small"
                defaultValue={Placement.RELATIVE}
                value={showAnnotationsAtOrigin ? Placement.RELATIVE : Placement.COLUMN}
                onChange={(v) => {
                  const enabled = v === Placement.RELATIVE;
                  pushEvent('toggle-show-annotations-at-origin', 'smart-editor', { enabled: enabled.toString() });
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

              <ToggleGroup
                size="small"
                value={String(expandedThreads)}
                onChange={(v) => {
                  const enabled = v === 'true';
                  pushEvent('toggle-expanded-threads', 'smart-editor', { enabled: v });
                  setExpandedThreads(enabled);
                }}
              >
                <ToggleGroup.Item value="true">Ekspander alle tråder</ToggleGroup.Item>
                <ToggleGroup.Item value="false">Ekspander kun valgt tråd</ToggleGroup.Item>
              </ToggleGroup>
            </VStack>
          </section>

          <section aria-labelledby="set-abbreviations">
            <StyledHeading level="2" size="small" spacing id="set-abbreviations">
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

enum Placement {
  RELATIVE = 'RELATIVE',
  COLUMN = 'COLUMN',
}

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
