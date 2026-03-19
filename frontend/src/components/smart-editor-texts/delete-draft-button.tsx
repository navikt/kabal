import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { useTextQuery } from '@/components/smart-editor-texts/hooks/use-text-query';
import { useDeleteDraftMutation } from '@/redux-api/texts/mutations';
import { useGetTextVersionsQuery } from '@/redux-api/texts/queries';

interface DeleteDraftProps {
  id: string;
  title: string;
  onDraftDeleted: () => void;
  children: string;
  tooltip?: string;
}

export const DeleteDraftButton = ({ id, title, onDraftDeleted, children, tooltip }: DeleteDraftProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, { isLoading }] = useDeleteDraftMutation({ fixedCacheKey: id });

  if (isOpen) {
    return (
      <>
        <Button
          data-color="neutral"
          size="small"
          variant="secondary"
          onClick={() => setIsOpen(false)}
          disabled={isLoading}
          icon={<XMarkIcon aria-hidden />}
        >
          Avbryt
        </Button>
        <ConfirmDeleteDraftButton id={id} title={title} onDraftDeleted={onDraftDeleted} tooltip={tooltip}>
          {children}
        </ConfirmDeleteDraftButton>
      </>
    );
  }

  if (tooltip === undefined) {
    return (
      <Button
        data-color="danger"
        size="small"
        variant="primary"
        onClick={() => setIsOpen(true)}
        icon={<TrashIcon aria-hidden />}
      >
        {children}
      </Button>
    );
  }

  return (
    <Tooltip content={tooltip}>
      <Button
        data-color="danger"
        size="small"
        variant="primary"
        onClick={() => setIsOpen(true)}
        icon={<TrashIcon aria-hidden />}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

const ConfirmDeleteDraftButton = ({ id, title, onDraftDeleted, children, tooltip }: DeleteDraftProps) => {
  const { data: versions = [] } = useGetTextVersionsQuery(id);
  const [deleteDraft, { isLoading }] = useDeleteDraftMutation({ fixedCacheKey: id });
  const query = useTextQuery();

  const onClick = useCallback(async () => {
    await deleteDraft({ id, title, query, versions });
    onDraftDeleted();
  }, [deleteDraft, id, title, query, versions, onDraftDeleted]);

  if (tooltip === undefined) {
    return (
      <Button
        data-color="danger"
        size="small"
        variant="primary"
        loading={isLoading}
        onClick={onClick}
        icon={<TrashIcon aria-hidden />}
      >
        {children}
      </Button>
    );
  }

  return (
    <Tooltip content={tooltip}>
      <Button
        data-color="danger"
        size="small"
        variant="primary"
        loading={isLoading}
        onClick={onClick}
        icon={<TrashIcon aria-hidden />}
      >
        {children}
      </Button>
    </Tooltip>
  );
};
