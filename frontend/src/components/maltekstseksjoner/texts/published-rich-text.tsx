import { PadlockLockedIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';
import React, { useRef } from 'react';
import { styled } from 'styled-components';
import { StyledHeading, getTitle } from '@app/components/editable-title/editable-title';
import { PublishedTextFooter } from '@app/components/maltekstseksjoner/texts/text-published-footer';
import { isRegelverk } from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import { RichTextEditor } from '@app/plate/types';
import { GOD_FORMULERING_TYPE, REGELVERK_TYPE, RichTextTypes } from '@app/types/common-text-types';
import { LANGUAGE_NAMES, UNTRANSLATED } from '@app/types/texts/language';
import { IPublishedGodFormulering, IPublishedRegelverk, IPublishedRichText } from '@app/types/texts/responses';
import { RedaktoerRichText } from '../../redaktoer-rich-text/redaktoer-rich-text';

interface Props {
  text: IPublishedRichText | IPublishedRegelverk | IPublishedGodFormulering;
  onDraftCreated: (versionId: string) => void;
  maltekstseksjonId?: string;
  hasDraft: boolean;
}

export const PublishedRichText = ({ text, onDraftCreated, maltekstseksjonId, hasDraft }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<RichTextEditor>(null);
  const lang = useRedaktoerLanguage();
  const savedContent = isRegelverk(text) ? text.richText[UNTRANSLATED] : text.richText[lang];

  return (
    <Container ref={containerRef}>
      <Header>
        {getIcon(text.textType)}
        <StyledHeading level="1" size="small">
          {getTitle(text.title)}
        </StyledHeading>
      </Header>

      {savedContent === null ? (
        <>
          <Alert variant="info" size="small">
            Tekst for {LANGUAGE_NAMES[lang].toLowerCase()} mangler
          </Alert>

          <PublishedTextFooter
            text={text}
            onDraftCreated={onDraftCreated}
            maltekstseksjonId={maltekstseksjonId}
            hasDraft={hasDraft}
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
            onDraftCreated={onDraftCreated}
            maltekstseksjonId={maltekstseksjonId}
            hasDraft={hasDraft}
          />
        </>
      )}
    </Container>
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
