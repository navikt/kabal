import {
  MaltekstseksjonReferences,
  MaltekstseksjonType,
} from '@app/components/malteksteksjon-references/maltekstseksjon-references';
import { useNavigateToStandaloneTextVersion } from '@app/hooks/use-navigate-to-standalone-text-version';
import { useUnpublishTextMutation } from '@app/redux-api/texts/mutations';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import type { TextTypes } from '@app/types/common-text-types';
import type { IText } from '@app/types/texts/responses';
import { TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack, HelpText } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { useTextQuery } from './hooks/use-text-query';

interface Props {
  publishedText: IText;
  textType: TextTypes;
}

export const UnpublishTextButton = ({ publishedText, textType }: Props) => {
  const { id } = publishedText;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, { isLoading }] = useUnpublishTextMutation({ fixedCacheKey: id });
  const { data: versions = [] } = useGetTextVersionsQuery(id);
  const draft = useMemo(() => versions.find(({ publishedDateTime }) => publishedDateTime === null), [versions]);

  if (!versions.some(({ published }) => published)) {
    return null;
  }

  if (isOpen) {
    return (
      <HStack gap="2" align="center">
        <ConfirmUnpublishTextButton publishedText={publishedText} textDraft={draft} textType={textType} />
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
      </HStack>
    );
  }

  return (
    <HStack gap="2" align="center">
      <Button size="small" variant="danger" onClick={() => setIsOpen(true)} icon={<TrashIcon aria-hidden />}>
        Avpubliser
      </Button>
      <Explainer />
    </HStack>
  );
};

const Explainer = () => (
  <HelpText>
    Ved å avpublisere denne teksten vil den ikke lenger være tilgjengelig for saksbehandlerne. Teksten kan når som helst
    publiseres igjen om ønskelig.
  </HelpText>
);

const ConfirmUnpublishTextButton = ({
  publishedText,
  textDraft,
  textType,
}: Props & { textDraft: IText | undefined }) => {
  const { id } = publishedText;
  const [unpublish, { isLoading }] = useUnpublishTextMutation({ fixedCacheKey: id });
  const navigate = useNavigateToStandaloneTextVersion(textType);
  const query = useTextQuery();

  const onClick = async () => {
    await unpublish({ publishedText, query, textDraft });

    if (textDraft === undefined) {
      return navigate({ id: null, versionId: null });
    }

    navigate({ versionId: textDraft.versionId });
  };

  return (
    <>
      <Warning {...publishedText} />
      <Button size="small" variant="danger" loading={isLoading} onClick={onClick} icon={<TrashIcon aria-hidden />}>
        Bekreft avpublisering
      </Button>
    </>
  );
};

interface WarningProps {
  id: string;
  draftMaltekstseksjonIdList: string[];
  publishedMaltekstseksjonIdList: string[];
}

const Warning = ({
  id,
  draftMaltekstseksjonIdList: draftList,
  publishedMaltekstseksjonIdList: publishedList,
}: WarningProps) => {
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

const StyledReferences = styled(MaltekstseksjonReferences)`
  display: inline-block;
`;
