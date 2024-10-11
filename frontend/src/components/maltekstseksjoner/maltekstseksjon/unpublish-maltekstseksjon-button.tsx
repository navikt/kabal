import { useNavigateMaltekstseksjoner } from '@app/hooks/use-navigate-maltekstseksjoner';
import { useUnpublishMaltekstseksjonMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { useGetMaltekstseksjonVersionsQuery } from '@app/redux-api/maltekstseksjoner/queries';
import type { IGetMaltekstseksjonParams } from '@app/types/common-text-types';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HelpText } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  query: IGetMaltekstseksjonParams;
  publishedMaltekstseksjon: IMaltekstseksjon;
}

export const UnpublishMaltekstseksjonButton = ({ publishedMaltekstseksjon, query }: Props) => {
  const { id } = publishedMaltekstseksjon;
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
        <ConfirmUnpublishMaltekstseksjonButton
          publishedMaltekstseksjon={publishedMaltekstseksjon}
          query={query}
          maltekstseksjonDraft={draft}
        />
        <Button
          size="small"
          variant="secondary"
          onClick={() => setIsOpen(false)}
          disabled={isLoading}
          icon={<XMarkIcon aria-hidden />}
        >
          Avbryt
        </Button>
        <Explainer />
      </Container>
    );
  }

  return (
    <Container>
      <Button size="small" variant="danger" onClick={() => setIsOpen(true)} icon={<TrashIcon aria-hidden />}>
        Avpubliser
      </Button>
      <Explainer />
    </Container>
  );
};

const Explainer = () => (
  <HelpText>
    Ved å avpublisere denne maltekstseksjonen vil den ikke lenger være tilgjengelig for saksbehandlerne.
    Maltekstseksjonen kan når som helst publiseres igjen om ønskelig.
  </HelpText>
);

const ConfirmUnpublishMaltekstseksjonButton = ({
  query,
  publishedMaltekstseksjon,
  maltekstseksjonDraft,
}: Props & { maltekstseksjonDraft: IMaltekstseksjon | undefined }) => {
  const [unpublish, { isLoading }] = useUnpublishMaltekstseksjonMutation({
    fixedCacheKey: publishedMaltekstseksjon.id,
  });
  const navigate = useNavigateMaltekstseksjoner();

  const onClick = async () => {
    await unpublish({ publishedMaltekstseksjon, query, maltekstseksjonDraft });

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
  align-items: center;
  gap: var(--a-spacing-2);
`;
