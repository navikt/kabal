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
import { styled } from 'styled-components';

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
        <StyledAlert variant="error" size="small" inline>
          Feil ved lasting: {error}
        </StyledAlert>
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
        <Overlay>
          <StyledLoader size="large" />
          <RedaktoerRichText
            editorId={editorId}
            savedContent={savedContent}
            readOnly
            lang={SPELL_CHECK_LANGUAGES[lang]}
          />
        </Overlay>
      </VStack>
    );
  }

  if (savedContent.length === 0) {
    return (
      <VStack flexGrow="1" position="relative" as="section">
        <StyledAlert variant="warning" size="small">
          Ingen tekster funnet
        </StyledAlert>
      </VStack>
    );
  }

  return (
    <VStack flexGrow="1" position="relative" as="section">
      <RedaktoerRichText editorId={editorId} savedContent={savedContent} readOnly lang={SPELL_CHECK_LANGUAGES[lang]} />
    </VStack>
  );
};

const StyledLoader = styled(Loader)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const Overlay = styled.div`
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(2px);
  }
`;

const StyledAlert = styled(Alert)`
  margin-top: var(--a-spacing-2);
`;
