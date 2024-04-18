import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useCallback, useState } from 'react';
import { useLanguageRedaktoer } from '@app/hooks/use-language-redaktoer';
import { useDeleteDraftMutation } from '@app/redux-api/texts/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { useTextQuery } from './hooks/use-text-query';

interface Props {
  id: string;
  title: string;
  onDraftDeleted: () => void;
  children: string;
}

export const DeleteDraftButton = ({ id, title, onDraftDeleted, children }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, { isLoading }] = useDeleteDraftMutation({ fixedCacheKey: id });

  if (isOpen) {
    return (
      <>
        <Button
          size="small"
          variant="secondary"
          onClick={() => setIsOpen(false)}
          disabled={isLoading}
          icon={<XMarkIcon aria-hidden />}
        >
          Avbryt
        </Button>
        <ConfirmDeleteDraftButton id={id} title={title} onDraftDeleted={onDraftDeleted}>
          {children}
        </ConfirmDeleteDraftButton>
      </>
    );
  }

  return (
    <Button size="small" variant="danger" onClick={() => setIsOpen(true)} icon={<TrashIcon aria-hidden />}>
      {children}
    </Button>
  );
};

const ConfirmDeleteDraftButton = ({ id, title, onDraftDeleted, children }: Props) => {
  const language = useLanguageRedaktoer();
  const { data = [] } = useGetTextVersionsQuery(language === null ? skipToken : { id, language });
  const [deleteDraft, { isLoading }] = useDeleteDraftMutation({ fixedCacheKey: id });
  const query = useTextQuery();

  const onClick = useCallback(async () => {
    const lastPublishedVersion = data.find((version) => version.published);

    if (language === null) {
      return;
    }

    await deleteDraft({ id, title, query, lastPublishedVersion, language });

    onDraftDeleted();
  }, [data, deleteDraft, id, language, onDraftDeleted, query, title]);

  return (
    <Button size="small" variant="danger" loading={isLoading} onClick={onClick} icon={<TrashIcon aria-hidden />}>
      {children}
    </Button>
  );
};
