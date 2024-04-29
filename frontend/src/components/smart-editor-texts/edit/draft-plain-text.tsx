import React, { useCallback, useEffect, useState } from 'react';
import { Edit } from '@app/components/smart-editor-texts/edit/edit';
import { HeaderFooterEditor } from '@app/components/smart-editor-texts/edit/header-footer';
import { getLanguageNames } from '@app/components/smart-editor-texts/functions/get-language-names';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { usePublishMutation, useUpdatePlainTextMutation } from '@app/redux-api/texts/mutations';
import { PlainTextTypes } from '@app/types/common-text-types';
import { LANGUAGES, Language, isLanguage } from '@app/types/texts/language';
import { IPlainText } from '@app/types/texts/responses';

interface Props extends Omit<DraftVersionProps, 'text'> {
  text: IPlainText;
}

type PlainTexts = Record<Language, string>;

const languagesWithChanges = (a: PlainTexts, b: PlainTexts): Language[] =>
  LANGUAGES.filter((lang) => a[lang] !== b[lang]);

export const DraftPlainText = ({ text, onDraftDeleted }: Props) => {
  const query = useTextQuery();
  const language = useRedaktoerLanguage();
  const [updatePlainText, plainTextStatus] = useUpdatePlainTextMutation({ fixedCacheKey: text.id });
  const [publish] = usePublishMutation();
  const [plainTexts, setPlainTexts] = useState<PlainTexts>(text.plainText);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const changes = languagesWithChanges(plainTexts, text.plainText);

    if (changes.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      changes.forEach((lang) => {
        updatePlainText({ query, plainText: plainTexts[lang], id: text.id, language: lang });
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [language, plainTexts, query, text.id, text.plainText, updatePlainText]);

  const onPublish = useCallback(async () => {
    const untranslated: Language[] = Object.entries(plainTexts)
      .filter(([, t]) => t === null || t === '')
      .map(([l]) => l)
      .filter(isLanguage);

    if (untranslated.length > 0) {
      setError(`Teksten må oversettes til ${getLanguageNames(untranslated)} før publisering`);

      return;
    }

    setError(undefined);

    const changes = languagesWithChanges(plainTexts, text.plainText);

    const promises = changes.map((lang) =>
      updatePlainText({ query, plainText: plainTexts[lang], id: text.id, language: lang }),
    );

    await Promise.all(promises);

    publish({ query, id: text.id });
  }, [plainTexts, publish, query, text.id, text.plainText, updatePlainText]);

  return (
    <Edit text={text} onDraftDeleted={onDraftDeleted} status={plainTextStatus} onPublish={onPublish} error={error}>
      {Object.values(Language).map((lang) => (
        <LanguageEditor
          key={lang}
          language={lang}
          initialValue={text.plainText[lang]}
          type={text.textType}
          onChange={(t) => setPlainTexts({ ...plainTexts, [lang]: t })}
        />
      ))}
    </Edit>
  );
};

interface LanguageEditorProps {
  language: Language;
  initialValue: string;
  type: PlainTextTypes;
  onChange: (plainText: string) => void;
}

const LanguageEditor = ({ initialValue, type, language, onChange }: LanguageEditorProps) => {
  const activeLang = useRedaktoerLanguage();

  if (language !== activeLang) {
    return null;
  }

  return <HeaderFooterEditor initialValue={initialValue} type={type} update={onChange} />;
};
