import { Alert, Loader } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { isRichText } from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import { EditorValue } from '@app/plate/types';
import { useUpdateTextIdListMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { useLazyGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { isApiError } from '@app/types/errors';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { IRichText } from '@app/types/texts/responses';

interface Props {
  maltekstseksjon: IMaltekstseksjon;
  nextMaltekstseksjon?: IMaltekstseksjon;
}

export const MaltekstseksjonPreview = ({ maltekstseksjon, nextMaltekstseksjon }: Props) => {
  const [, { isLoading: isUpdating }] = useUpdateTextIdListMutation({ fixedCacheKey: maltekstseksjon.id });
  const [texts, setTexts] = useState<IRichText[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [getTextVersions] = useLazyGetTextVersionsQuery();
  const { textIdList } = maltekstseksjon;
  const lang = useRedaktoerLanguage();
  const editorId = `${textIdList.join(':')}-${lang}-preview`;

  useEffect(() => {
    setError(null);

    const promises = textIdList.map((textId) => getTextVersions(textId, true).unwrap());

    Promise.all(promises)
      .then((textVersionsList) =>
        textVersionsList
          .map((textVersions) =>
            textVersions.find((v) => {
              if (maltekstseksjon.publishedDateTime === null || nextMaltekstseksjon === undefined) {
                return true;
              }

              if (nextMaltekstseksjon.publishedDateTime === null) {
                return v.publishedDateTime !== null;
              }

              return v.publishedDateTime !== null && v.publishedDateTime < nextMaltekstseksjon.publishedDateTime;
            }),
          )
          .filter(isNotUndefined),
      )
      .then((textList) => setTexts(textList.filter(isRichText)))
      .catch((e) => setError('data' in e && isApiError(e.data) ? e.data.detail : e.message));
  }, [getTextVersions, maltekstseksjon.published, maltekstseksjon.publishedDateTime, nextMaltekstseksjon, textIdList]);

  if (error !== null) {
    return (
      <Section>
        <StyledAlert variant="error" size="small" inline>
          Feil ved lasting: {error}
        </StyledAlert>
      </Section>
    );
  }

  if (texts.length === 0 && textIdList.length !== 0) {
    return (
      <Section>
        <Loader size="medium" title="Laster..." />
      </Section>
    );
  }

  const savedContent = texts.reduce<EditorValue>((acc, { richText }) => {
    const content = richText[lang];

    return content === null ? acc : [...acc, ...content];
  }, []);

  if (isUpdating) {
    return (
      <Section>
        <Overlay>
          <StyledLoader size="large" />
          <RedaktoerRichText
            editorId={editorId}
            savedContent={savedContent}
            readOnly
            lang={SPELL_CHECK_LANGUAGES[lang]}
          />
        </Overlay>
      </Section>
    );
  }

  if (savedContent.length === 0) {
    return (
      <Section>
        <StyledAlert variant="warning" size="small">
          Ingen tekster funnet
        </StyledAlert>
      </Section>
    );
  }

  return (
    <Section>
      <RedaktoerRichText editorId={editorId} savedContent={savedContent} readOnly lang={SPELL_CHECK_LANGUAGES[lang]} />
    </Section>
  );
};

const Section = styled.section`
  position: relative;
`;

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
  margin-top: 8px;
`;
