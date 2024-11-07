import { isDepublished, isPublished } from '@app/components/smart-editor-texts/functions/status-helpers';
import { useDeleteDraftVersionMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { useGetMaltekstseksjonVersionsQuery } from '@app/redux-api/maltekstseksjoner/queries';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useMemo, useState } from 'react';

interface Props {
  id: string;
  title: string;
  query: IGetMaltekstseksjonParams;
  onDraftDeleted: () => void;
}

export const DeleteMaltekstseksjonDraftButton = ({ id, title, onDraftDeleted, query }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, { isLoading }] = useDeleteDraftVersionMutation({ fixedCacheKey: id });
  const { data: versions = [] } = useGetMaltekstseksjonVersionsQuery(id);
  const willBeMovedToDepublished = useMemo(
    () => versions.some(isDepublished) && !versions.some(isPublished),
    [versions],
  );

  const text = willBeMovedToDepublished ? 'Slett utkast og sett maltekstseksjon som avpublisert' : 'Slett utkast';

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
        <ConfirmDeleteDraftButton
          id={id}
          title={title}
          onDraftDeleted={onDraftDeleted}
          query={query}
          versions={versions}
        >
          {text}
        </ConfirmDeleteDraftButton>
      </>
    );
  }

  return (
    <Button size="small" variant="danger" onClick={() => setIsOpen(true)} icon={<TrashIcon aria-hidden />}>
      {text}
    </Button>
  );
};

interface ConfirmProps extends Props {
  children: string;
  versions: IMaltekstseksjon[];
}

const ConfirmDeleteDraftButton = ({ id, title, onDraftDeleted, children, query, versions }: ConfirmProps) => {
  const [deleteDraft, { isLoading }] = useDeleteDraftVersionMutation({ fixedCacheKey: id });

  const onClick = async () => {
    await deleteDraft({ id, query, versions, title });
    onDraftDeleted();
  };

  return (
    <Button size="small" variant="danger" loading={isLoading} onClick={onClick} icon={<TrashIcon aria-hidden />}>
      {children}
    </Button>
  );
};
