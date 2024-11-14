import { StyledHeading, getTitle } from '@app/components/editable-title/editable-title';
import { PublishedTextFooter } from '@app/components/maltekstseksjoner/texts/text-published-footer';
import { isRegelverk } from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import type { RichTextEditor } from '@app/plate/types';
import { type GOD_FORMULERING_TYPE, type REGELVERK_TYPE, RichTextTypes } from '@app/types/common-text-types';
import { LANGUAGE_NAMES, UNTRANSLATED } from '@app/types/texts/language';
import type { IPublishedGodFormulering, IPublishedRegelverk, IPublishedRichText } from '@app/types/texts/responses';
import { PadlockLockedIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';
import { useRef } from 'react';
import { styled } from 'styled-components';
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
  flex-grow: 1;
  position: relative;
  padding-top: var(--a-spacing-2);
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  column-gap: var(--a-spacing-2);
  margin-bottom: var(--a-spacing-1);
  min-height: var(--a-spacing-8);
`;
