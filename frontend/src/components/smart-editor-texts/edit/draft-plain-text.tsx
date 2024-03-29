import React, { useCallback, useEffect, useState } from 'react';
import { Edit } from '@app/components/smart-editor-texts/edit/edit';
import { HeaderFooterEditor } from '@app/components/smart-editor-texts/edit/header-footer';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { usePublishMutation, useUpdatePlainTextMutation } from '@app/redux-api/texts/mutations';
import { IPlainText } from '@app/types/texts/responses';

interface Props extends Omit<DraftVersionProps, 'text'> {
  text: IPlainText;
}

export const DraftPlainText = ({ text, onDraftDeleted }: Props) => {
  const query = useTextQuery();
  const [updatePlainText, plainTextStatus] = useUpdatePlainTextMutation({ fixedCacheKey: text.id });
  const [publish] = usePublishMutation();
  const [plainText, setPlainText] = useState<string>(text.plainText);

  useEffect(() => {
    if (plainText === text.plainText) {
      return;
    }

    const timer = setTimeout(() => {
      updatePlainText({ query, plainText, id: text.id });
    }, 1000);

    return () => clearTimeout(timer);
  }, [plainText, query, text.id, text.plainText, updatePlainText]);

  const onPublish = useCallback(async () => {
    if (plainText !== text.plainText) {
      await updatePlainText({ query, plainText, id: text.id });
    }

    publish({ query, id: text.id });
  }, [plainText, publish, query, text.id, text.plainText, updatePlainText]);

  return (
    <Edit text={text} onDraftDeleted={onDraftDeleted} status={plainTextStatus} onPublish={onPublish}>
      <HeaderFooterEditor initialValue={text.plainText} type={text.textType} update={setPlainText} />
    </Edit>
  );
};
