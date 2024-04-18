import { BodyLong, Heading } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { PublishedTextFooter } from '@app/components/maltekstseksjoner/texts/text-published-footer';
import { TagContainer, TagList } from '@app/components/smart-editor-texts/edit/tags';
import { useEnhetNameFromIdOrLoading } from '@app/hooks/use-kodeverk-ids';
import { PublishedPlainTextVersion } from '@app/types/texts/responses';

interface Props {
  text: PublishedPlainTextVersion;
  onDraftCreated: (id: string) => void;
}

export const PublishedPlainText = ({ text, onDraftCreated }: Props) => (
  <PublishedContainer>
    <Heading level="1" size="small" spacing>
      {text.title}
    </Heading>

    <TagContainer>
      <TagList
        variant="enhetIdList"
        noneLabel="Alle enheter"
        ids={text.enhetIdList}
        useName={useEnhetNameFromIdOrLoading}
      />
    </TagContainer>

    <Background>
      <StyledBodyLong>{text.plainText}</StyledBodyLong>
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
