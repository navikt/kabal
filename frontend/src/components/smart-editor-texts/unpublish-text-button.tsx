import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Button } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import {
  MaltekstseksjonReferences,
  MaltekstseksjonType,
} from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { useNavigateToStandaloneTextVersion } from '@app/hooks/use-navigate-to-standalone-text-version';
import { useUnpublishTextMutation } from '@app/redux-api/texts/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { REGELVERK_TYPE, TextTypes } from '@app/types/common-text-types';
import { IText } from '@app/types/texts/responses';
import { useTextQuery } from './hooks/use-text-query';

interface Props {
  id: string;
  title: string;
  publishedMaltekstseksjonIdList: string[];
  draftMaltekstseksjonIdList: string[];
  textType: TextTypes;
}

export const UnpublishTextButton = ({ id, title, ...props }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, { isLoading }] = useUnpublishTextMutation({ fixedCacheKey: id });
  const { data: versions = [] } = useGetTextVersionsQuery(id);
  const draft = useMemo(() => versions.find(({ publishedDateTime }) => publishedDateTime === null), [versions]);

  if (!versions.some(({ published }) => published)) {
    return null;
  }

  if (isOpen) {
    return (
      <Container>
        <ConfirmUnpublishTextButton id={id} title={title} textDraft={draft} {...props} />
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

const ConfirmUnpublishTextButton = ({
  id,
  title,
  textDraft,
  textType,
  draftMaltekstseksjonIdList = [],
  publishedMaltekstseksjonIdList = [],
}: Props & { textDraft: IText | undefined }) => {
  const [unpublish, { isLoading }] = useUnpublishTextMutation({ fixedCacheKey: id });
  const navigate = useNavigateToStandaloneTextVersion(textType !== REGELVERK_TYPE);
  const query = useTextQuery();

  const onClick = async () => {
    await unpublish({ id, title, query, textDraft });

    if (textDraft === undefined) {
      return navigate({ id: null, versionId: null });
    }

    navigate({ versionId: textDraft.versionId });
  };

  return (
    <>
      <Warning
        id={id}
        draftMaltekstseksjonIdList={draftMaltekstseksjonIdList}
        publishedMaltekstseksjonIdList={publishedMaltekstseksjonIdList}
      />
      <Button size="small" variant="danger" loading={isLoading} onClick={onClick} icon={<TrashIcon aria-hidden />}>
        Bekreft avpublisering
      </Button>
    </>
  );
};

const Warning = ({
  id,
  draftMaltekstseksjonIdList: draftList,
  publishedMaltekstseksjonIdList: publishedList,
}: Omit<Props, 'title' | 'textType'>) => {
  if (draftList.length === 0 && publishedList.length === 0) {
    return null;
  }

  return (
    <Alert inline size="small" variant="warning">
      Denne teksten er referert til i
      <StyledReferences
        maltekstseksjonIdList={draftList}
        currentMaltekstseksjonId={id}
        type={MaltekstseksjonType.DRAFT}
      >
        {draftList.length.toString(10)} utkast
      </StyledReferences>
      {draftList.length > 0 && publishedList.length > 0 ? ' og' : null}
      <StyledReferences
        maltekstseksjonIdList={publishedList}
        currentMaltekstseksjonId={id}
        type={MaltekstseksjonType.PUBLISHED}
      >
        {publishedList.length.toString(10)} {publishedList.length === 1 ? 'publisering' : 'publiseringer'}
      </StyledReferences>
      og vil ikke lenger være tilgjengelig for {getSuffix(draftList, publishedList)}.
    </Alert>
  );
};

const getSuffix = (draftList: string[], publishedList: string[]) => {
  if (draftList.length + publishedList.length > 1) {
    return 'disse';
  }

  if (draftList.length === 1) {
    return 'dette';
  }

  return 'denne';
};

const Container = styled.div`
  display: flex;
  gap: 8px;
`;

const StyledReferences = styled(MaltekstseksjonReferences)`
  display: inline-block;
`;
