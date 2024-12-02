import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { Edit } from '@app/components/smart-editor-texts/edit/edit';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import type { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { SpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import type { KabalValue } from '@app/plate/types';
import { usePublishMutation, useUpdateRichTextMutation } from '@app/redux-api/texts/mutations';
import { UNTRANSLATED } from '@app/types/texts/language';
import type { IRegelverk } from '@app/types/texts/responses';
import { ErrorMessage } from '@navikt/ds-react';
import { useCallback, useEffect, useState } from 'react';

interface Props extends Omit<DraftVersionProps, 'text'> {
  text: IRegelverk;
}

export const DraftRegelverk = ({ text, onDraftDeleted }: Props) => {
  const query = useTextQuery();
  const [updateRichText, richTextStatus] = useUpdateRichTextMutation({ fixedCacheKey: text.id });
  const [publish] = usePublishMutation();
  const savedRichText = text.richText[UNTRANSLATED];
  const [richText, setRichText] = useState<KabalValue>(savedRichText);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (areDescendantsEqual(richText, savedRichText)) {
      return;
    }

    const timer = setTimeout(() => {
      updateRichText({ query, richText, id: text.id, language: UNTRANSLATED });
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, richText, savedRichText, text.id, updateRichText]);

  const onPublish = useCallback(async () => {
    if (text.ytelseHjemmelIdList.length === 0) {
      return setError('Du må velge minst én hjemmel før du kan publisere');
    }

    setError(null);

    if (!areDescendantsEqual(richText, savedRichText)) {
      await updateRichText({ query, richText, id: text.id, language: UNTRANSLATED });
    }

    publish({ query, id: text.id });
  }, [richText, publish, query, savedRichText, text.id, updateRichText, text]);

  return (
    <Edit text={text} onDraftDeleted={onDraftDeleted} onPublish={onPublish}>
      {error === null ? null : <ErrorMessage style={{ alignSelf: 'flex-end' }}>{error}</ErrorMessage>}
      <RedaktoerRichText
        editorId={text.id}
        savedContent={savedRichText}
        onChange={({ value }) => setRichText(value)}
        lang={SpellCheckLanguage.NB}
        status={{ ...richTextStatus, modified: text.modified }}
      />
    </Edit>
  );
};
