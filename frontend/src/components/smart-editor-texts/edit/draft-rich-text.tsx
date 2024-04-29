import React, { useCallback, useEffect, useState } from 'react';
import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { Edit } from '@app/components/smart-editor-texts/edit/edit';
import { getLanguageNames } from '@app/components/smart-editor-texts/functions/get-language-names';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import { EditorValue } from '@app/plate/types';
import { isNodeEmpty } from '@app/plate/utils/queries';
import { usePublishMutation, useUpdateRichTextMutation } from '@app/redux-api/texts/mutations';
import { LANGUAGES, Language, isLanguage } from '@app/types/texts/language';
import { IRichText } from '@app/types/texts/responses';

interface Props extends Omit<DraftVersionProps, 'text'> {
  text: IRichText;
}

type RichTexts = Record<Language, EditorValue>;

const languagesWithChanges = (a: RichTexts, b: RichTexts): Language[] =>
  LANGUAGES.filter((lang) => !areDescendantsEqual(a[lang], b[lang]));

export const DraftRichText = ({ text, onDraftDeleted }: Props) => {
  const query = useTextQuery();
  const [updateRichText, richTextStatus] = useUpdateRichTextMutation({ fixedCacheKey: text.id });
  const [publish] = usePublishMutation();
  const language = useRedaktoerLanguage();
  const [richTexts, setRichTexts] = useState<RichTexts>(text.richText);
  const [error, setError] = useState<string>();

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
    const untranslated: Language[] = Object.entries(richTexts)
      .filter(([, t]) => t === null || t.every(isNodeEmpty))
      .map(([l]) => l)
      .filter(isLanguage);

    if (untranslated.length > 0) {
      setError(`Teksten må oversettes til ${getLanguageNames(untranslated)} før publisering`);

      return;
    }

    setError(undefined);

    const changes = languagesWithChanges(richTexts, text.richText);

    const promises = changes.map((lang) =>
      updateRichText({ query, richText: richTexts[lang], id: text.id, language: lang }),
    );

    await Promise.all(promises);

    publish({ query, id: text.id });
  }, [richTexts, text.richText, text.id, publish, query, updateRichText]);

  const savedContent = text.richText[language];

  return (
    <Edit text={text} onDraftDeleted={onDraftDeleted} status={richTextStatus} onPublish={onPublish} error={error}>
      <RedaktoerRichText
        editorId={`${text.id}-${language}`}
        savedContent={savedContent}
        onChange={(t) => setRichTexts({ ...richTexts, [language]: t })}
        lang={SPELL_CHECK_LANGUAGES[language]}
      />
    </Edit>
  );
};
