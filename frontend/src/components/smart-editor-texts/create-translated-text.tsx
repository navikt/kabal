import { Button, HStack } from '@navikt/ds-react';
import { useTextQuery } from '@/components/smart-editor-texts/hooks/use-text-query';
import { useRedaktoerLanguage } from '@/hooks/use-redaktoer-language';
import { createSimpleParagraph } from '@/plate/templates/helpers';
import { useUpdatePlainTextMutation, useUpdateRichTextMutation } from '@/redux-api/texts/mutations';
import { LANGUAGE_NAMES } from '@/types/texts/language';

interface Props {
  id: string;
}

export const CreateTranslatedRichText = ({ id }: Props) => {
  const query = useTextQuery();
  const [updateRichText, { isLoading }] = useUpdateRichTextMutation({ fixedCacheKey: id });
  const language = useRedaktoerLanguage();

  return (
    <HStack padding="space-16" justify="center">
      <Button
        size="small"
        onClick={() => updateRichText({ query, richText: [createSimpleParagraph()], id, language })}
        loading={isLoading}
      >
        Opprett versjon på {LANGUAGE_NAMES[language].toLowerCase()}
      </Button>
    </HStack>
  );
};

export const CreateTranslatedPlainText = ({ id }: Props) => {
  const query = useTextQuery();
  const [updatePlainText, { isLoading }] = useUpdatePlainTextMutation({ fixedCacheKey: id });
  const language = useRedaktoerLanguage();

  return (
    <HStack padding="space-16" justify="center">
      <Button size="small" onClick={() => updatePlainText({ query, plainText: '', id, language })} loading={isLoading}>
        Opprett versjon på {LANGUAGE_NAMES[language].toLowerCase()}
      </Button>
    </HStack>
  );
};
