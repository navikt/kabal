import { getTitle } from '@app/components/editable-title/editable-title';
import { PublishedTextFooter } from '@app/components/maltekstseksjoner/texts/text-published-footer';
import { Tags } from '@app/components/smart-editor-texts/edit/tags';
import { isoDateTimeToPretty } from '@app/domain/date';
import { isRegelverk } from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import type { RichTextEditor } from '@app/plate/types';
import { GOD_FORMULERING_TYPE, REGELVERK_TYPE, RichTextTypes } from '@app/types/common-text-types';
import { LANGUAGE_NAMES, UNTRANSLATED } from '@app/types/texts/language';
import type { IPublishedGodFormulering, IPublishedRegelverk, IPublishedRichText } from '@app/types/texts/responses';
import { PadlockLockedIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, HStack, Heading, Label, VStack } from '@navikt/ds-react';
import { useRef } from 'react';
import { RedaktoerRichText } from '../../redaktoer-rich-text/redaktoer-rich-text';

interface Props {
  text: IPublishedRichText | IPublishedRegelverk | IPublishedGodFormulering;
  maltekstseksjonId?: string;
  hasDraft: boolean;
  setTabId: (versionId: string) => void;
}

export const PublishedRichText = ({ text, maltekstseksjonId, hasDraft, setTabId }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<RichTextEditor>(null);
  const lang = useRedaktoerLanguage();
  const savedContent = isRegelverk(text) ? text.richText[UNTRANSLATED] : text.richText[lang];

  const publishedId = `${text.id}-published`;

  return (
    <VStack ref={containerRef} position="relative" paddingBlock="2 0" flexGrow="1" overflowY="auto">
      <VStack as="header" gap="2" marginBlock="0 2" minHeight="var(--a-spacing-8)">
        <HStack gap="2" justify="space-between" align="center" paddingInline="0 2">
          <Heading level="1" size="small">
            {getTitle(text.title)}
          </Heading>

          {getIcon(text.textType)}
        </HStack>

        <HStack align="center" gap="1">
          <Label size="small" htmlFor={publishedId}>
            Publisert:
          </Label>

          <BodyShort id={publishedId}>
            <time dateTime={text.publishedDateTime}>{isoDateTimeToPretty(text.publishedDateTime)}</time>
            <span>, av {text.publishedByActor.navn}</span>
          </BodyShort>
        </HStack>

        {text.textType === GOD_FORMULERING_TYPE || text.textType === REGELVERK_TYPE ? <Tags {...text} /> : null}
      </VStack>

      {savedContent === null ? (
        <>
          <Alert variant="info" size="small">
            Tekst for {LANGUAGE_NAMES[lang].toLowerCase()} mangler
          </Alert>

          <PublishedTextFooter
            text={text}
            maltekstseksjonId={maltekstseksjonId}
            hasDraft={hasDraft}
            setTabId={setTabId}
          />
        </>
      ) : (
        <>
          <RedaktoerRichText
            ref={editorRef}
            editorId={`${text.id}-${lang}`}
            savedContent={savedContent}
            readOnly
            lang={SPELL_CHECK_LANGUAGES[lang]}
          />

          <PublishedTextFooter
            text={text}
            maltekstseksjonId={maltekstseksjonId}
            hasDraft={hasDraft}
            setTabId={setTabId}
          />
        </>
      )}
    </VStack>
  );
};

const getIcon = (textType: RichTextTypes | typeof REGELVERK_TYPE | typeof GOD_FORMULERING_TYPE) => {
  switch (textType) {
    case RichTextTypes.MALTEKST:
      return <PadlockLockedIcon aria-hidden fontSize={20} title="Låst tekst" />;
    case RichTextTypes.REDIGERBAR_MALTEKST:
      return <PencilWritingIcon aria-hidden fontSize={20} title="Redigerbar tekst" />;
    default:
      return null;
  }
};
