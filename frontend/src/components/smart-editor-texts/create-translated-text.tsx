import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { useUpdatePlainTextMutation, useUpdateRichTextMutation } from '@app/redux-api/texts/mutations';
import { LANGUAGE_NAMES } from '@app/types/texts/language';
import { Button, HStack } from '@navikt/ds-react';

interface Props {
  id: string;
}

export const CreateTranslatedRichText = ({ id }: Props) => {
  const query = useTextQuery();
  const [updateRichText, { isLoading }] = useUpdateRichTextMutation({ fixedCacheKey: id });
  const language = useRedaktoerLanguage();

  return (
    <HStack padding="4" justify="center">
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
    <HStack padding="4" justify="center">
      <Button size="small" onClick={() => updatePlainText({ query, plainText: '', id, language })} loading={isLoading}>
        Opprett versjon på {LANGUAGE_NAMES[language].toLowerCase()}
      </Button>
    </HStack>
  );
};
