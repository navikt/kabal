import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { isRichText } from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import type { KabalValue } from '@app/plate/types';
import { useUpdateTextIdListMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { useLazyGetTextByIdQuery } from '@app/redux-api/texts/queries';
import { isApiDataError } from '@app/types/errors';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import type { IRichText } from '@app/types/texts/responses';
import { Alert, Loader, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

interface Props {
  maltekstseksjon: IMaltekstseksjon;
}

export const MaltekstseksjonPreview = ({ maltekstseksjon }: Props) => {
  const [, { isLoading: isUpdating }] = useUpdateTextIdListMutation({ fixedCacheKey: maltekstseksjon.id });
  const [texts, setTexts] = useState<IRichText[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [getText] = useLazyGetTextByIdQuery();
  const { textIdList } = maltekstseksjon;
  const lang = useRedaktoerLanguage();
  const editorId = `${textIdList.join(':')}-${lang}-preview`;

  useEffect(() => {
    setError(null);

    const promises = textIdList.map((textId) => getText(textId, true).unwrap());

    Promise.all(promises)
      .then((textList) => setTexts(textList.filter(isRichText)))
      .catch((e) => setError(isApiDataError(e) ? e.data.detail : e.message));
  }, [getText, textIdList]);

  if (error !== null) {
    return (
      <VStack flexGrow="1" position="relative" as="section">
        <Alert variant="error" size="small" className="mt-2" inline>
          Feil ved lasting: {error}
        </Alert>
      </VStack>
    );
  }

  if (texts.length === 0 && textIdList.length > 0) {
    return (
      <VStack flexGrow="1" position="relative" as="section">
        <Loader size="medium" title="Laster..." />
      </VStack>
    );
  }

  const savedContent = texts.reduce<KabalValue>((acc, { richText }) => {
    const content = richText[lang];

    if (content !== null) {
      acc.push(...content);
    }

    return acc;
  }, []);

  if (isUpdating) {
    return (
      <VStack flexGrow="1" position="relative" as="section">
        <div className="after:absolute after:top-0 after:left-0 after:h-full after:w-full after:backdrop-blur-[2px]">
          <Loader size="large" className="-translate-1/2 absolute top-1/2 left-1/2 z-1" />
          <RedaktoerRichText
            editorId={editorId}
            savedContent={savedContent}
            readOnly
            lang={SPELL_CHECK_LANGUAGES[lang]}
          />
        </div>
      </VStack>
    );
  }

  if (savedContent.length === 0) {
    return (
      <VStack flexGrow="1" position="relative" as="section">
        <Alert variant="warning" size="small" className="mt-2">
          Ingen tekster funnet
        </Alert>
      </VStack>
    );
  }

  return (
    <VStack flexGrow="1" position="relative" as="section">
      <RedaktoerRichText editorId={editorId} savedContent={savedContent} readOnly lang={SPELL_CHECK_LANGUAGES[lang]} />
    </VStack>
  );
};
