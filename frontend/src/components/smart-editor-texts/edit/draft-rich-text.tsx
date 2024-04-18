import React, { useCallback, useEffect, useState } from 'react';
import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { Edit } from '@app/components/smart-editor-texts/edit/edit';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { useLanguageRedaktoer } from '@app/hooks/use-language-redaktoer';
import { EditorValue } from '@app/plate/types';
import { usePublishMutation, useUpdateContentMutation } from '@app/redux-api/texts/mutations';
import { Language } from '@app/types/texts/language';
import { DraftRichTextVersion } from '@app/types/texts/responses';

interface Props extends Omit<DraftVersionProps, 'text'> {
  text: DraftRichTextVersion;
}

export const DraftRichText = ({ text, onDraftDeleted }: Props) => {
  const query = useTextQuery();
  const [updateRichText, richTextStatus] = useUpdateContentMutation({ fixedCacheKey: text.id });
  const [publish] = usePublishMutation();
  const [richText, setRichText] = useState<EditorValue>(text.richText);
  const language = useLanguageRedaktoer() ?? Language.NB;

  useEffect(() => {
    if (areDescendantsEqual(richText, text.richText)) {
      return;
    }

    const timer = setTimeout(() => {
      updateRichText({ query, richText, id: text.id, language });
    }, 1000);

    return () => clearTimeout(timer);
  }, [richText, query, text.richText, text.id, updateRichText, language]);

  const onPublish = useCallback(async () => {
    if (!areDescendantsEqual(richText, text.richText)) {
      await updateRichText({ query, richText, id: text.id, language });
    }

    publish({ query, id: text.id });
  }, [richText, text.richText, text.id, publish, query, updateRichText, language]);

  return (
    <Edit text={text} onDraftDeleted={onDraftDeleted} status={richTextStatus} onPublish={onPublish}>
      <RedaktoerRichText editorId={text.id} savedContent={text.richText} onChange={setRichText} />
    </Edit>
  );
};
