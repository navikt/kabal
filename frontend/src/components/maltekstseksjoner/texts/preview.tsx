import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { isRichText } from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import { useGetTextByIdQuery } from '@app/redux-api/texts/queries';
import {
  GOD_FORMULERING_TYPE,
  MALTEKSTSEKSJON_TYPE,
  REGELVERK_TYPE,
  RichTextTypes,
} from '@app/types/common-text-types';
import { LANGUAGE_NAMES } from '@app/types/texts/language';
import { Alert, ErrorMessage, Heading, HStack, Loader, Tag, type TagProps } from '@navikt/ds-react';

interface Props {
  textId: string;
  className?: string;
}

export const TextPreview = ({ textId, className }: Props) => {
  const { data: text, isLoading } = useGetTextByIdQuery(textId);
  const language = useRedaktoerLanguage();

  if (isLoading || text === undefined) {
    return <Loader size="small" />;
  }

  if (!isRichText(text)) {
    return (
      <ErrorMessage>
        Tekst {text.title} ({text.created}) er ikke en riktekst: {text.textType}
      </ErrorMessage>
    );
  }

  const [name, tagVariant] = getRichTextTypeTagVariantAndName(text.textType);

  const savedContent = text.richText[language];

  return (
    <section className={className}>
      <HStack align="center" justify="start" as="header">
        <Heading level="1" size="small">
          {text.title}
        </Heading>
        <Tag size="xsmall" variant={tagVariant}>
          {name}
        </Tag>
      </HStack>

      {savedContent === null ? (
        <Alert variant="info" size="small">
          Tekst for {LANGUAGE_NAMES[language].toLowerCase()} mangler
        </Alert>
      ) : (
        <RedaktoerRichText
          editorId={textId}
          savedContent={savedContent}
          readOnly
          lang={SPELL_CHECK_LANGUAGES[language]}
        />
      )}
    </section>
  );
};

const getRichTextTypeTagVariantAndName = (
  textType: RichTextTypes | typeof REGELVERK_TYPE | typeof GOD_FORMULERING_TYPE | typeof MALTEKSTSEKSJON_TYPE,
): [string, TagProps['variant']] => {
  switch (textType) {
    case RichTextTypes.MALTEKST:
      return ['Maltekst', 'alt1'];
    case RichTextTypes.REDIGERBAR_MALTEKST:
      return ['Redigerbar maltekst', 'warning'];
    case GOD_FORMULERING_TYPE:
      return ['God formulering', 'success'];
    case REGELVERK_TYPE:
      return ['Regelverk', 'info'];
    case MALTEKSTSEKSJON_TYPE:
      return ['Maltekstseksjon', 'neutral'];
  }
};
