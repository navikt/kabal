import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { CreateTranslatedRichText } from '@app/components/smart-editor-texts/create-translated-text';
import { Edit } from '@app/components/smart-editor-texts/edit/edit';
import { getLanguageNames } from '@app/components/smart-editor-texts/functions/get-language-names';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import type { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@app/hooks/use-smart-editor-language';
import type { KabalValue } from '@app/plate/types';
import { usePublishMutation, useUpdateRichTextMutation } from '@app/redux-api/texts/mutations';
import { LANGUAGES, type Language, isLanguage } from '@app/types/texts/language';
import type { IGodFormulering, IRichText } from '@app/types/texts/responses';
import { useCallback, useEffect, useState } from 'react';

interface Props extends Omit<DraftVersionProps, 'text'> {
  text: IRichText | IGodFormulering;
}

type RichTexts = Record<Language, KabalValue | null>;

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

type Validate = (richTexts: RichTexts) => boolean;

export const DraftRichText = (props: Props) => {
  const [error, setError] = useState<string>();

  const isValid: Validate = (richTexts) => {
    const untranslated: Language[] = Object.entries(richTexts)
      .filter(([, t]) => t === null)
      .map(([l]) => l)
      .filter(isLanguage);

    if (untranslated.length > 0) {
      setError(`Teksten må oversettes til ${getLanguageNames(untranslated)} før publisering`);

      return false;
    }

    return true;
  };

  return <DraftRichTextBase {...props} validate={isValid} error={error} />;
};

export const DraftGodFormulering = (props: Props) => {
  const [error, setError] = useState<string>();

  const isValid: Validate = (richTexts) => {
    if (Object.values(richTexts).every((t) => t === null)) {
      setError('Teksten må eksistere på minst ett språk før publisering');

      return false;
    }

    setError(undefined);

    return true;
  };

  return <DraftRichTextBase {...props} validate={isValid} error={error} />;
};

interface DraftRichText2Props extends Props {
  validate: Validate;
  error: string | undefined;
}

const DraftRichTextBase = ({ text, onDraftDeleted, validate, error }: DraftRichText2Props) => {
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
      for (const lang of changes) {
        updateRichText({ query, richText: richTexts[lang], id: text.id, language: lang });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, text.id, updateRichText, richTexts, text.richText]);

  const onPublish = useCallback(async () => {
    if (!validate(richTexts)) {
      return;
    }

    const changes = languagesWithChanges(richTexts, text.richText);

    const promises = changes.map((lang) =>
      updateRichText({ query, richText: richTexts[lang], id: text.id, language: lang }),
    );

    await Promise.all(promises);

    publish({ query, id: text.id });
  }, [validate, richTexts, text.richText, text.id, publish, query, updateRichText]);

  const savedContent = text.richText[language];

  if (savedContent === null) {
    return <CreateTranslatedRichText id={text.id} />;
  }

  return (
    <Edit
      text={text}
      onDraftDeleted={onDraftDeleted}
      status={{ ...richTextStatus, modified: text.modified }}
      onPublish={onPublish}
      deleteTranslation={() => updateRichText({ query, richText: null, id: text.id, language })}
      error={error}
    >
      {LANGUAGES.map((lang) => (
        <LanguageEditor
          key={lang}
          language={lang}
          text={text}
          savedContent={savedContent}
          richTexts={richTexts}
          setRichTexts={setRichTexts}
        />
      ))}
    </Edit>
  );
};

interface LanguageEditorProps {
  language: Language;
  text: IRichText | IGodFormulering;
  savedContent: KabalValue;
  richTexts: RichTexts;
  setRichTexts: (richTexts: RichTexts) => void;
}

const LanguageEditor = ({ language, text, savedContent, setRichTexts, richTexts }: LanguageEditorProps) => {
  const activeLang = useRedaktoerLanguage();

  if (activeLang !== language) {
    return null;
  }

  return (
    <RedaktoerRichText
      editorId={`${text.id}-${language}`}
      savedContent={savedContent}
      onChange={(t) => setRichTexts({ ...richTexts, [language]: t })}
      lang={SPELL_CHECK_LANGUAGES[language]}
    />
  );
};
