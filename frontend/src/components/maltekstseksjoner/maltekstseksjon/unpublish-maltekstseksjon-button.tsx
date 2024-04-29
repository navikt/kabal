import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { useNavigateMaltekstseksjoner } from '@app/hooks/use-navigate-maltekstseksjoner';
import { useUnpublishMaltekstseksjonMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { useGetMaltekstseksjonVersionsQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';

interface Props {
  id: string;
  title: string;
  query: IGetMaltekstseksjonParams;
}

export const UnpublishMaltekstseksjonButton = ({ id, title, query }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, { isLoading }] = useUnpublishMaltekstseksjonMutation({ fixedCacheKey: id });
  const { data: versions = [] } = useGetMaltekstseksjonVersionsQuery(id);
  const draft = useMemo(() => versions.find(({ publishedDateTime }) => publishedDateTime === null), [versions]);

  if (!versions.some(({ published }) => published)) {
    return null;
  }

  if (isOpen) {
    return (
      <Container>
        <ConfirmUnpublishMaltekstseksjonButton id={id} title={title} query={query} maltekstseksjonDraft={draft} />
        <Button
          size="small"
          variant="secondary"
          onClick={() => setIsOpen(false)}
          disabled={isLoading}
          icon={<XMarkIcon aria-hidden />}
        >
          Avbryt
        </Button>
      </Container>
    );
  }

  return (
    <Button size="small" variant="danger" onClick={() => setIsOpen(true)} icon={<TrashIcon aria-hidden />}>
      Avpubliser aktiv versjon
    </Button>
  );
};

const ConfirmUnpublishMaltekstseksjonButton = ({
  id,
  title,
  query,
  maltekstseksjonDraft,
}: Props & { maltekstseksjonDraft: IMaltekstseksjon | undefined }) => {
  const [unpublish, { isLoading }] = useUnpublishMaltekstseksjonMutation({ fixedCacheKey: id });
  const navigate = useNavigateMaltekstseksjoner();

  const onClick = async () => {
    await unpublish({ id, title, query, maltekstseksjonDraft });

    if (maltekstseksjonDraft === undefined) {
      return navigate({ maltekstseksjonId: null, maltekstseksjonVersionId: null, textId: null });
    }

    navigate({ maltekstseksjonVersionId: maltekstseksjonDraft.versionId });
  };

  return (
    <Button size="small" variant="danger" loading={isLoading} onClick={onClick} icon={<TrashIcon aria-hidden />}>
      Bekreft avpublisering
    </Button>
  );
};

const Container = styled.div`
  display: flex;
  gap: 8px;
`;
