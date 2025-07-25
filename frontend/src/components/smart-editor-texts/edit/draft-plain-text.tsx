import type { SavedStatusProps } from '@app/components/saved-status/saved-status';
import { CreateTranslatedPlainText } from '@app/components/smart-editor-texts/create-translated-text';
import { Edit } from '@app/components/smart-editor-texts/edit/edit';
import { HeaderFooterEditor } from '@app/components/smart-editor-texts/edit/header-footer';
import { getLanguageNames } from '@app/components/smart-editor-texts/functions/get-language-names';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import type { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { usePublishMutation, useUpdatePlainTextMutation } from '@app/redux-api/texts/mutations';
import type { PlainTextTypes } from '@app/types/common-text-types';
import { isLanguage, LANGUAGES, type Language } from '@app/types/texts/language';
import type { IPlainText } from '@app/types/texts/responses';
import { useCallback, useEffect, useState } from 'react';

interface Props extends Omit<DraftVersionProps, 'text'> {
  text: IPlainText;
}

type PlainTexts = Record<Language, string | null>;

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
    setPlainTexts(text.plainText);
  }, [text.plainText]);

  useEffect(() => {
    const changes = languagesWithChanges(plainTexts, text.plainText);

    if (changes.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      for (const lang of changes) {
        updatePlainText({ query, plainText: plainTexts[lang], id: text.id, language: lang });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [plainTexts, query, text.id, text.plainText, updatePlainText]);

  const onPublish = useCallback(async () => {
    const untranslated: Language[] = Object.entries(plainTexts)
      .filter(([, t]) => t === null)
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

  const initialValue = text.plainText[language];

  if (initialValue === null) {
    return <CreateTranslatedPlainText id={text.id} />;
  }

  return (
    <Edit text={text} onDraftDeleted={onDraftDeleted} onPublish={onPublish} error={error}>
      {LANGUAGES.map((lang) => (
        <LanguageEditor
          key={lang}
          language={lang}
          initialValue={initialValue}
          type={text.textType}
          onChange={(t) => setPlainTexts({ ...plainTexts, [lang]: t })}
          status={{ ...plainTextStatus, modified: text.modified }}
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
  status: SavedStatusProps;
}

const LanguageEditor = ({ initialValue, type, language, onChange, status }: LanguageEditorProps) => {
  const activeLang = useRedaktoerLanguage();

  if (language !== activeLang) {
    return null;
  }

  return <HeaderFooterEditor initialValue={initialValue} type={type} update={onChange} status={status} />;
};
