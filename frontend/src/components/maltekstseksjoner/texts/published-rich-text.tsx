import { PadlockLockedIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import React, { useRef } from 'react';
import { styled } from 'styled-components';
import { StyledHeading, getTitle } from '@app/components/editable-title/editable-title';
import { PublishedTextFooter } from '@app/components/maltekstseksjoner/texts/text-published-footer';
import { RichTextEditor } from '@app/plate/types';
import { RichTextTypes } from '@app/types/common-text-types';
import { PublishedRichTextVersion } from '@app/types/texts/responses';
import { RedaktoerRichText } from '../../redaktoer-rich-text/redaktoer-rich-text';

interface Props {
  text: PublishedRichTextVersion;
  onDraftCreated: (versionId: string) => void;
  maltekstseksjonId?: string;
}

export const PublishedRichText = ({ text, onDraftCreated, maltekstseksjonId }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<RichTextEditor>(null);

  return (
    <Container ref={containerRef}>
      <Header>
        {getIcon(text.textType)}
        <StyledHeading level="1" size="small">
          {getTitle(text.title)}
        </StyledHeading>
      </Header>

      <RedaktoerRichText ref={editorRef} editorId={text.id} savedContent={text.richText} readOnly />

      <PublishedTextFooter text={text} onDraftCreated={onDraftCreated} maltekstseksjonId={maltekstseksjonId} />
    </Container>
  );
};

const getIcon = (textType: RichTextTypes) => {
  switch (textType) {
    case RichTextTypes.MALTEKST:
      return <PadlockLockedIcon aria-hidden fontSize={20} title="Låst tekst" />;
    case RichTextTypes.REDIGERBAR_MALTEKST:
      return <PencilWritingIcon aria-hidden fontSize={20} title="Redigerbar tekst" />;
    default:
      return null;
  }
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: 8px;
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  column-gap: 8px;
  margin-bottom: 4px;
  min-height: 32px;
`;
