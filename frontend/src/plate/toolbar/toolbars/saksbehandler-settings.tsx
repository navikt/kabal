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
import { isLanguage, Language } from '@app/types/texts/language';
import { CogIcon } from '@navikt/aksel-icons';
import { Heading, Modal, ToggleGroup, VStack } from '@navikt/ds-react';
import { useCallback, useContext, useId, useRef, useState } from 'react';

export const SaksbehandlerSettings = () => {
  const { hasWriteAccess, showAnnotationsAtOrigin, setShowAnnotationsAtOrigin } = useContext(SmartEditorContext);
  const { value: expandedThreads = true, setValue: setExpandedThreads } = useSmartEditorExpandedThreads();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const language = useSmartEditorLanguage();
  const [setLanguage] = useSetSmartEditorLanguage();
  const modalHeadingId = useId();
  const langHeadingId = useId();
  const commentHeadingId = useId();
  const abbreviationsHeadingId = useId();

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
        aria-labelledby={modalHeadingId}
        closeOnBackdropClick
      >
        <Modal.Header>
          <Heading size="medium" level="1" id={modalHeadingId}>
            Innstillinger for brevutforming
          </Heading>
        </Modal.Header>
        <Modal.Body className="flex flex-col gap-y-4">
          {hasWriteAccess ? (
            <section aria-labelledby={langHeadingId}>
              <Heading level="2" size="small" spacing id={langHeadingId}>
                Språk
              </Heading>
              <ToggleGroup size="small" value={language} onChange={onChangeLanguage}>
                <ToggleGroup.Item value={Language.NB}>Bokmål</ToggleGroup.Item>
                <ToggleGroup.Item value={Language.NN}>Nynorsk</ToggleGroup.Item>
              </ToggleGroup>
            </section>
          ) : null}

          <Capitalise />

          <section aria-labelledby={commentHeadingId}>
            <Heading level="2" size="small" spacing id={commentHeadingId}>
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

          <section aria-labelledby={abbreviationsHeadingId}>
            <Heading
              level="2"
              size="small"
              spacing
              id={abbreviationsHeadingId}
              className="flex flex-row items-center gap-x-2"
            >
              <AbbreviationsHeadingContent />
            </Heading>

            <AbbreviationsExplanation />

            <AbbreviationsContent headingSize="xsmall" />
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
};

enum Placement {
  RELATIVE = 'RELATIVE',
  COLUMN = 'COLUMN',
}
