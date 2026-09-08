import { CogIcon } from '@navikt/aksel-icons';
import { Dialog, Heading, ToggleGroup, VStack } from '@navikt/ds-react';
import { useEditorReadOnly } from 'platejs/react';
import { useCallback, useId, useState } from 'react';
import { AbbreviationsContent, AbbreviationsHeadingContent } from '@/components/settings/abbreviations/abbreviations';
import { AbbreviationsExplanation } from '@/components/settings/abbreviations/explanation';
import { useSmartEditorAnnotationsAtOrigin, useSmartEditorExpandedThreads } from '@/hooks/settings/use-setting';
import { useSetSmartEditorLanguage } from '@/hooks/use-set-smart-editor-language';
import { useSmartEditorLanguage } from '@/hooks/use-smart-editor-language';
import { pushEvent } from '@/observability';
import { Capitalise } from '@/plate/toolbar/capitalise';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';
import { isLanguage, Language } from '@/types/texts/language';

export const SaksbehandlerSettings = () => {
  const { value: showAnnotationsAtOrigin = false, setValue: setShowAnnotationsAtOrigin } =
    useSmartEditorAnnotationsAtOrigin();
  const readOnly = useEditorReadOnly();
  const { value: expandedThreads = true, setValue: setExpandedThreads } = useSmartEditorExpandedThreads();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const language = useSmartEditorLanguage();
  const [setLanguage] = useSetSmartEditorLanguage();
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

  const onOpenChange = useCallback((open: boolean) => {
    setIsSettingsOpen(open);

    if (open) {
      pushEvent('open-settings', 'smart-editor');
    }
  }, []);

  return (
    <Dialog onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        <ToolbarIconButton
          label="Innstillinger - språk, forkortelser, kommentarer og bokmerker"
          icon={<CogIcon aria-hidden />}
          active={isSettingsOpen}
        />
      </Dialog.Trigger>
      <Dialog.Popup width="900px">
        <Dialog.Header>
          <Dialog.Title>Innstillinger for brevutforming</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-y-4">
          {readOnly ? null : (
            <section aria-labelledby={langHeadingId}>
              <Heading level="2" size="small" spacing id={langHeadingId}>
                Språk
              </Heading>
              <ToggleGroup size="small" value={language} onChange={onChangeLanguage}>
                <ToggleGroup.Item value={Language.NB}>Bokmål</ToggleGroup.Item>
                <ToggleGroup.Item value={Language.NN}>Nynorsk</ToggleGroup.Item>
              </ToggleGroup>
            </section>
          )}

          <Capitalise />

          <section aria-labelledby={commentHeadingId}>
            <Heading level="2" size="small" spacing id={commentHeadingId}>
              Kommentarer og bokmerker
            </Heading>

            <VStack gap="space-12">
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
                  Vis kommentarer og bokmerker frikoblet fra innhold
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
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  );
};

enum Placement {
  RELATIVE = 'RELATIVE',
  COLUMN = 'COLUMN',
}
