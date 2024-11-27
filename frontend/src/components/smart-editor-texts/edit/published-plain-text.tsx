import { ModifiedCreatedDateTime } from '@app/components/datetime/datetime';
import { CreateDraftTextButton } from '@app/components/smart-editor-texts/create-draft-button';
import { DuplicateTextButton } from '@app/components/smart-editor-texts/duplicate-text-button';
import { Changelog } from '@app/components/smart-editor-texts/edit/changelog';
import { Tags } from '@app/components/smart-editor-texts/edit/tags';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { UnpublishTextButton } from '@app/components/smart-editor-texts/unpublish-text-button';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import type { IPublishedPlainText } from '@app/types/texts/responses';
import { BodyLong, Box, HStack, Heading, Label, VStack } from '@navikt/ds-react';
import { useId } from 'react';

interface Props {
  text: IPublishedPlainText;
  hasDraft: boolean;
  setTabId: (versionId: string) => void;
}

export const PublishedPlainText = ({ text, hasDraft, setTabId }: Props) => {
  const lang = useRedaktoerLanguage();
  const query = useTextQuery();
  const { id, textType, created, edits } = text;
  const [lastEdit] = edits;
  const { data: versions = [] } = useGetTextVersionsQuery(id);

  const modifiedId = useId();

  return (
    <VStack gap="2" padding="4">
      <Heading level="1" size="small" spacing>
        {text.title}
      </Heading>

      <HStack gap="2" align="center">
        <Label size="small" htmlFor={modifiedId}>
          Sist endret:
        </Label>
        <ModifiedCreatedDateTime id={modifiedId} lastEdit={lastEdit} created={created} />
        <Changelog versions={versions} />
      </HStack>

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
