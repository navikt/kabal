import { RedaktoerRichText } from '@/components/redaktoer-rich-text/redaktoer-rich-text';
import type { SavedStatusProps } from '@/components/saved-status/saved-status';
import { useRedaktoerLanguage } from '@/hooks/use-redaktoer-language';
import { SPELL_CHECK_LANGUAGES } from '@/hooks/use-smart-editor-language';
import type { KabalValue, RichTextEditor } from '@/plate/types';
import type { Language } from '@/types/texts/language';
import type { IRichText } from '@/types/texts/responses';

export type RichTexts = Record<Language, KabalValue | null>;

interface LanguageEditorProps {
  language: Language;
  text: IRichText;
  savedContent: KabalValue;
  richTexts: RichTexts;
  setRichTexts: (richTexts: RichTexts) => void;
  editorRef: React.RefObject<RichTextEditor | null>;
  richTextRef: React.MutableRefObject<RichTexts>;
  setActive: (textId: string) => void;
  status: SavedStatusProps;
}

export const LanguageEditor = ({
  language,
  setActive,
  text,
  editorRef,
  richTextRef,
  savedContent,
  setRichTexts,
  richTexts,
  status,
}: LanguageEditorProps) => {
  const activeLang = useRedaktoerLanguage();

  if (activeLang !== language) {
    return null;
  }

  return (
    <RedaktoerRichText
      ref={editorRef}
      editorId={`${text.id}-${language}`}
      savedContent={savedContent}
      onChange={({ value }) => {
        const changed: RichTexts = { ...richTexts, [language]: value };
        richTextRef.current = changed;
        setRichTexts(changed);
      }}
      onFocus={() => setActive(text.id)}
      lang={SPELL_CHECK_LANGUAGES[language]}
      status={status}
    />
  );
};
