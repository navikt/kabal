import { UploadIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import { DeleteMaltekstseksjonDraftButton } from '@app/components/maltekstseksjoner/maltekstseksjon/draft/delete-draft-button';
import {
  useDeleteDraftVersionMutation,
  usePublishMutation,
  usePublishWithTextsMutation,
} from '@app/redux-api/maltekstseksjoner/mutations';
import { IGetTextsParams } from '@app/types/maltekstseksjoner/params';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { ActionsContainer } from '../common';

interface Props {
  maltekstseksjon: IMaltekstseksjon;
  query: IGetTextsParams;
  onDraftDeleted: () => void;
}

export const Actions = ({ query, onDraftDeleted, maltekstseksjon }: Props) => {
  const { id, title } = maltekstseksjon;

  return (
    <ActionsContainer>
      <PublishButtons maltekstseksjon={maltekstseksjon} query={query} />

      <DeleteMaltekstseksjonDraftButton id={id} query={query} onDraftDeleted={onDraftDeleted} title={title} />
    </ActionsContainer>
  );
};

interface PublishButtonProps {
  maltekstseksjon: IMaltekstseksjon;
  query: IGetTextsParams;
}

const PublishButtons = ({ query, maltekstseksjon }: PublishButtonProps) => {
  const [publish, { isLoading: isPublishing }] = usePublishMutation();
  const [publishWithTexts, { isLoading: isPublishingWithTexts }] = usePublishWithTextsMutation();
  const [, { isLoading: isDeleting }] = useDeleteDraftVersionMutation();

  const { id } = maltekstseksjon;

  const onPublish = useCallback(() => publish({ id, query }), [id, publish, query]);
  const onPublishWithTexts = useCallback(() => publishWithTexts({ id, query }), [id, publishWithTexts, query]);

  const loading = isPublishing || isPublishingWithTexts || isDeleting;
  const noTexts = maltekstseksjon.textIdList.length === 0;

  const props: ButtonProps = {
    size: 'small',
    variant: 'primary',
    icon: <UploadIcon aria-hidden />,
    loading,
    disabled: noTexts,
    title: getTitle(noTexts),
  };

  return (
    <>
      <Button {...props} onClick={onPublish}>
        Publiser maltekstseksjon
      </Button>
      <Button {...props} onClick={onPublishWithTexts}>
        Publiser maltekstseksjon og alle tekster
      </Button>
    </>
  );
};

const getTitle = (noTexts: boolean) => (noTexts ? 'Du må legge til minst én tekst før du kan publisere' : undefined);
