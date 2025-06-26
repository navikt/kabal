import { CreateDraftTextButton } from '@app/components/smart-editor-texts/create-draft-button';
import { DuplicateTextButton } from '@app/components/smart-editor-texts/duplicate-text-button';
import { Tags } from '@app/components/smart-editor-texts/edit/tags';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { TextModified } from '@app/components/smart-editor-texts/modified';
import { UnpublishTextButton } from '@app/components/smart-editor-texts/unpublish-text-button';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import type { IPublishedPlainText } from '@app/types/texts/responses';
import { BodyLong, Box, Heading, HStack, VStack } from '@navikt/ds-react';

interface Props {
  text: IPublishedPlainText;
  hasDraft: boolean;
  setTabId: (versionId: string) => void;
}

export const PublishedPlainText = ({ text, hasDraft, setTabId }: Props) => {
  const lang = useRedaktoerLanguage();
  const query = useTextQuery();
  const { textType } = text;

  return (
    <VStack gap="2" padding="4">
      <Heading level="1" size="small" spacing>
        {text.title}
      </Heading>

      <TextModified {...text} />

      <Tags {...text} />

      <HStack gap="2" justify="end" marginInline="auto 0">
        {hasDraft ? null : <CreateDraftTextButton text={text} onDraftCreated={setTabId} query={query} />}

        <DuplicateTextButton {...text} />

        <UnpublishTextButton publishedText={text} textType={textType} />
      </HStack>

      <VStack as={Box} gap="4" background="bg-subtle" padding="4">
        <Box as={BodyLong} background="bg-default" padding="4" borderRadius="medium" shadow="medium">
          {text.plainText[lang]}
        </Box>
      </VStack>
    </VStack>
  );
};
