import { CogIcon } from '@navikt/aksel-icons';
import { Dialog, Heading, HStack, VStack } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { AbbreviationsContent, AbbreviationsHeadingContent } from '@/components/settings/abbreviations/abbreviations';
import { AbbreviationsExplanation } from '@/components/settings/abbreviations/explanation';
import { pushEvent } from '@/observability';
import { Capitalise } from '@/plate/toolbar/capitalise';
import { ToolbarIconButton } from '@/plate/toolbar/toolbarbutton';

export const RedkatoerSettings = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const onOpenChange = useCallback((open: boolean) => {
    setIsSettingsOpen(open);

    if (open) {
      pushEvent('redaktoer-open-settings', 'redaktoer');
    }
  }, []);

  return (
    <Dialog onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        <ToolbarIconButton
          label="Innstillinger - forkortelser"
          icon={<CogIcon aria-hidden />}
          active={isSettingsOpen}
        />
      </Dialog.Trigger>
      <Dialog.Popup width="900px">
        <Dialog.Header>
          <Dialog.Title>Innstillinger for brevutforming</Dialog.Title>
        </Dialog.Header>

        <VStack asChild gap="space-16">
          <Dialog.Body>
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
          </Dialog.Body>
        </VStack>
      </Dialog.Popup>
    </Dialog>
  );
};
