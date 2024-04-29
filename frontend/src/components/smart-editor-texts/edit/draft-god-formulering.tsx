import { Button } from '@navikt/ds-react';
import React, { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { Edit } from '@app/components/smart-editor-texts/edit/edit';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { EditorValue } from '@app/plate/types';
import { usePublishMutation, useUpdateRichTextMutation } from '@app/redux-api/texts/mutations';
import { LANGUAGES, LANGUAGE_NAMES, Language } from '@app/types/texts/language';
import { IGodFormulering } from '@app/types/texts/responses';

interface Props extends Omit<DraftVersionProps, 'text'> {
  text: IGodFormulering;
}

type RichTexts = Record<Language, EditorValue | null>;

const languagesWithChanges = (a: RichTexts, b: RichTexts): Language[] =>
  LANGUAGES.filter((lang) => {
    const aLang = a[lang];
    const bLang = b[lang];

    if (aLang === null && bLang === null) {
      return false;
    }

    if (aLang === null || bLang === null) {
      return true;
    }

    return !areDescendantsEqual(aLang, bLang);
  });

export const DraftGodFormulering = ({ text, onDraftDeleted }: Props) => {
  const query = useTextQuery();
  const [updateRichText, richTextStatus] = useUpdateRichTextMutation({ fixedCacheKey: text.id });
  const [publish] = usePublishMutation();
  const language = useRedaktoerLanguage();
  const [richTexts, setRichTexts] = useState<RichTexts>(text.richText);

  useEffect(() => {
    setRichTexts(text.richText);
  }, [text.richText]);

  useEffect(() => {
    const changes = languagesWithChanges(richTexts, text.richText);

    if (changes.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      changes.forEach((lang) => {
        updateRichText({ query, richText: richTexts[lang], id: text.id, language: lang });
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, text.id, updateRichText, language, richTexts, text.richText]);

  const onPublish = useCallback(async () => {
    const changes = languagesWithChanges(richTexts, text.richText);

    const promises = changes.map((lang) =>
      updateRichText({ query, richText: richTexts[lang], id: text.id, language: lang }),
    );

    await Promise.all(promises);

    publish({ query, id: text.id });
  }, [richTexts, text.richText, text.id, publish, query, updateRichText]);

  const deleteTranslation = () => updateRichText({ query, richText: null, id: text.id, language });

  const savedContent = text.richText[language];

  if (savedContent === null) {
    return (
      <ButtonWrapper>
        <Button
          size="small"
          onClick={() => updateRichText({ query, richText: [createSimpleParagraph()], id: text.id, language })}
          loading={richTextStatus.isLoading}
        >
          Opprett versjon på {LANGUAGE_NAMES[language].toLowerCase()}
        </Button>
      </ButtonWrapper>
    );
  }

  return (
    <Edit
      text={text}
      onDraftDeleted={onDraftDeleted}
      status={richTextStatus}
      onPublish={onPublish}
      deleteTranslation={deleteTranslation}
    >
      <RedaktoerRichText
        editorId={`${text.id}-${language}`}
        savedContent={savedContent}
        onChange={(t) => setRichTexts({ ...richTexts, [language]: t })}
        lang={SPELL_CHECK_LANGUAGES[language]}
      />
    </Edit>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
`;
