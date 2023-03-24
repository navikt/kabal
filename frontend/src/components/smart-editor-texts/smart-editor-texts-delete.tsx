import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useDeleteTextMutation } from '@app/redux-api/texts';
import { useTextNavigate } from './hooks/use-text-navigate';
import { useTextQuery } from './hooks/use-text-query';

interface Props {
  id: string;
  title: string;
}

export const DeleteTextButton = ({ id, title }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, { isLoading }] = useDeleteTextMutation({ fixedCacheKey: id });

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
        <ConfirmDeleleTextButton id={id} title={title} />
      </>
    );
  }

  return (
    <Button size="small" variant="danger" onClick={() => setIsOpen(true)} icon={<TrashIcon aria-hidden />}>
      Slett
    </Button>
  );
};

const ConfirmDeleleTextButton = ({ id, title }: Props) => {
  const [deleteText, { isLoading }] = useDeleteTextMutation({ fixedCacheKey: id });
  const navigate = useTextNavigate();
  const query = useTextQuery();

  const onClick = async () => {
    await deleteText({ id, title, query });
    navigate();
  };

  return (
    <Button size="small" variant="danger" loading={isLoading} onClick={onClick} icon={<TrashIcon aria-hidden />}>
      Slett
    </Button>
  );
};
