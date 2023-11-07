import { Alert, Loader } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { isRichText } from '@app/functions/is-rich-plain-text';
import { EditorValue } from '@app/plate/types';
import { useUpdateTextIdListMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { useLazyGetTextByIdQuery } from '@app/redux-api/texts/queries';
import { isApiError } from '@app/types/errors';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { IRichText } from '@app/types/texts/responses';

interface Props {
  maltekstseksjon: IMaltekstseksjon;
}

export const MaltekstseksjonPreview = ({ maltekstseksjon }: Props) => {
  const [, { isLoading: isUpdating }] = useUpdateTextIdListMutation({ fixedCacheKey: maltekstseksjon.id });
  const [texts, setTexts] = useState<IRichText[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [getText] = useLazyGetTextByIdQuery();
  const { textIdList } = maltekstseksjon;
  const editorId = textIdList.join(':');

  useEffect(() => {
    setError(null);

    const promises = textIdList.map((textId) => getText(textId, true).unwrap());

    Promise.all(promises)
      .then((_texts) => setTexts(_texts.filter(isRichText)))
      .catch((e) => setError('data' in e && isApiError(e.data) ? e.data.detail : e.message));
  }, [getText, textIdList]);

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

  const savedContent = texts.reduce<EditorValue>((acc, { content }) => [...acc, ...content], []);

  if (isUpdating) {
    return (
      <Section>
        <Overlay>
          <StyledLoader size="large" />
          <RedaktoerRichText editorId={editorId} savedContent={savedContent} readOnly />
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
      <RedaktoerRichText editorId={editorId} savedContent={savedContent} readOnly />
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
