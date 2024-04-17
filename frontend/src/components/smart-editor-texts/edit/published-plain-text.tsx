import { BodyLong, Heading } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { PublishedTextFooter } from '@app/components/maltekstseksjoner/texts/text-published-footer';
import { Tags } from '@app/components/smart-editor-texts/edit/tags';
import { getLanguageContent } from '@app/functions/get-translated-content';
import { IPublishedPlainText } from '@app/types/texts/responses';

interface Props {
  text: IPublishedPlainText;
  onDraftCreated: (id: string) => void;
}

export const PublishedPlainText = ({ text, onDraftCreated }: Props) => (
  <PublishedContainer>
    <Heading level="1" size="small" spacing>
      {text.title}
    </Heading>

    <Tags {...text} />

    <Background>
      <StyledBodyLong>{getLanguageContent(language, text.plainText)}</StyledBodyLong>
    </Background>

    <PublishedTextFooter text={text} onDraftCreated={onDraftCreated} />
  </PublishedContainer>
);

const Background = styled.div`
  background: var(--a-bg-subtle);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PublishedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
`;

const StyledBodyLong = styled(BodyLong)`
  background: var(--a-bg-default);
  padding: 16px;
  border-radius: 4px;
  box-shadow: var(--a-shadow-medium);
`;
