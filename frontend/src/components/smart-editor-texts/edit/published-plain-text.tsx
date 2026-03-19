import { BodyLong, Box, Heading, HStack, VStack } from '@navikt/ds-react';
import { CreateDraftTextButton } from '@/components/smart-editor-texts/create-draft-button';
import { DuplicateTextButton } from '@/components/smart-editor-texts/duplicate-text-button';
import { Tags } from '@/components/smart-editor-texts/edit/tags';
import { useTextQuery } from '@/components/smart-editor-texts/hooks/use-text-query';
import { TextModified } from '@/components/smart-editor-texts/modified';
import { UnpublishTextButton } from '@/components/smart-editor-texts/unpublish-text-button';
import { useRedaktoerLanguage } from '@/hooks/use-redaktoer-language';
import type { IPublishedPlainText } from '@/types/texts/responses';

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
    <VStack gap="space-8" padding="space-16">
      <Heading level="1" size="small" spacing>
        {text.title}
      </Heading>
      <TextModified {...text} />
      <Tags {...text} />
      <HStack gap="space-8" justify="end" marginInline="auto space-0">
        {hasDraft ? null : <CreateDraftTextButton text={text} onDraftCreated={setTabId} query={query} />}

        <DuplicateTextButton {...text} />

        <UnpublishTextButton publishedText={text} textType={textType} />
      </HStack>
      <Box background="neutral-moderate" padding="space-16" borderRadius="4">
        <Box as={BodyLong} background="default" padding="space-16" borderRadius="4" shadow="dialog">
          {text.plainText[lang]}
        </Box>
      </Box>
    </VStack>
  );
};
