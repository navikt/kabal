import { useDeleteDraftMutation } from '@app/redux-api/texts/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
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
  const { data: versions = [] } = useGetTextVersionsQuery(id);
  const [deleteDraft, { isLoading }] = useDeleteDraftMutation({ fixedCacheKey: id });
  const query = useTextQuery();

  const onClick = useCallback(async () => {
    await deleteDraft({ id, title, query, versions });
    onDraftDeleted();
  }, [deleteDraft, id, title, query, versions, onDraftDeleted]);

  return (
    <Button size="small" variant="danger" loading={isLoading} onClick={onClick} icon={<TrashIcon aria-hidden />}>
      {children}
    </Button>
  );
};
