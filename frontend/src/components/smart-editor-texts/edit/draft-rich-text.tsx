import React, { useCallback, useEffect, useState } from 'react';
import { RedaktoerRichText } from '@app/components/redaktoer-rich-text/redaktoer-rich-text';
import { Edit } from '@app/components/smart-editor-texts/edit/edit';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { EditorValue } from '@app/plate/types';
import { usePublishMutation, useUpdateContentMutation } from '@app/redux-api/texts/mutations';
import { IRichText } from '@app/types/texts/responses';

interface Props extends Omit<DraftVersionProps, 'text'> {
  text: IRichText;
}

export const DraftRichText = ({ text, onDraftDeleted }: Props) => {
  const query = useTextQuery();
  const [updateRichText, richTextStatus] = useUpdateContentMutation({ fixedCacheKey: text.id });
  const [publish] = usePublishMutation();
  const [content, setContent] = useState<EditorValue>(text.content);

  useEffect(() => {
    if (areDescendantsEqual(content, text.content)) {
      return;
    }

    const timer = setTimeout(() => {
      updateRichText({ query, content, id: text.id });
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, query, text.content, text.id, updateRichText]);

  const onPublish = useCallback(async () => {
    if (!areDescendantsEqual(content, text.content)) {
      await updateRichText({ query, content, id: text.id });
    }

    publish({ query, id: text.id });
  }, [content, publish, query, text.content, text.id, updateRichText]);

  return (
    <Edit text={text} onDraftDeleted={onDraftDeleted} status={richTextStatus} onPublish={onPublish}>
      <RedaktoerRichText editorId={text.id} savedContent={text.content} onChange={setContent} />
    </Edit>
  );
};
