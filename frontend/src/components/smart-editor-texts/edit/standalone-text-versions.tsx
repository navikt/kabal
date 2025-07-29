import { PublishedRichText } from '@app/components/maltekstseksjoner/texts/published-rich-text';
import { DraftRegelverk } from '@app/components/smart-editor-texts/edit/draft-regelverk';
import { DraftGodFormulering, DraftRichText } from '@app/components/smart-editor-texts/edit/draft-rich-text';
import { PublishedPlainText } from '@app/components/smart-editor-texts/edit/published-plain-text';
import type { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { VersionTabs } from '@app/components/versioned-tabs/versioned-tabs';
import { isGodFormulering, isRegelverk, isRichText } from '@app/functions/is-rich-plain-text';
import { useNavigateToStandaloneTextVersion } from '@app/hooks/use-navigate-to-standalone-text-version';
import { useGetTextByIdQuery, useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { PlainTextTypes, type TextTypes } from '@app/types/common-text-types';
import type { IDraft, IPlainText, IPublishedText, IText } from '@app/types/texts/responses';
import { Loader, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { useParams } from 'react-router';
import { DraftPlainText } from './draft-plain-text';

interface Props {
  id: string;
}

export const StandaloneTextVersions = ({ id }: Props) => {
  const { data = [], isFetching: isFetchingVersions } = useGetTextVersionsQuery(id);
  const { data: text } = useGetTextByIdQuery(id);

  if (isFetchingVersions || text === undefined) {
    return <Loader />;
  }

  const [first] = data;

  if (first === undefined) {
    return <p>Ingen tekst med ID {id}</p>;
  }

  return <VersionsLoaded versions={data} firstText={first} id={id} textType={text.textType} />;
};

interface VersionsLoadedProps {
  versions: IText[];
  firstText: IText;
  id: string;
  textType: TextTypes;
}

const VersionsLoaded = ({ versions, firstText, id, textType }: VersionsLoadedProps) => {
  const navigate = useNavigateToStandaloneTextVersion(textType);
  const publishedVersion = useMemo(() => versions.find(({ published }) => published), [versions]);
  const { versionId } = useParams();

  const onDraftDeleted = () =>
    navigate(
      publishedVersion?.versionId === undefined
        ? { id: null, versionId: null }
        : { id, versionId: publishedVersion.versionId },
    );

  const navigateToVersion = (vId: string) => navigate({ id, versionId: vId });

  const hasDraft = versions.some((v) => v.publishedDateTime === null);

  return (
    <VStack asChild height="100%" overflow="hidden" flexGrow="1">
      <VersionTabs<IDraft, IPublishedText>
        first={firstText}
        versions={versions}
        selectedTabId={versionId}
        setSelectedTabId={navigateToVersion}
        createDraftPanel={(v) => <DraftVersion text={v} onDraftDeleted={onDraftDeleted} />}
        createPublishedPanel={(v) => <PublishedVersion text={v} hasDraft={hasDraft} setTabId={navigateToVersion} />}
      />
    </VStack>
  );
};

const DraftVersion = ({ text, onDraftDeleted }: DraftVersionProps) => {
  if (isRichText(text)) {
    return <DraftRichText text={text} onDraftDeleted={onDraftDeleted} />;
  }

  if (isRegelverk(text)) {
    return <DraftRegelverk text={text} onDraftDeleted={onDraftDeleted} />;
  }

  if (isGodFormulering(text)) {
    return <DraftGodFormulering text={text} onDraftDeleted={onDraftDeleted} />;
  }

  if (isPlainText(text)) {
    return <DraftPlainText text={text} onDraftDeleted={onDraftDeleted} />;
  }

  return null;
};

interface PublishedVersionProps {
  text: IPublishedText;
  hasDraft: boolean;
  setTabId: (id: string) => void;
}

const PublishedVersion = ({ text, hasDraft, setTabId }: PublishedVersionProps) => {
  if (isPlainText(text)) {
    return <PublishedPlainText text={text} hasDraft={hasDraft} setTabId={setTabId} />;
  }

  return (
    <VStack gap="2" padding="4" height="100%">
      <PublishedRichText text={text} hasDraft={hasDraft} setTabId={setTabId} />
    </VStack>
  );
};

const isPlainText = (text: IText): text is IPlainText =>
  text.textType === PlainTextTypes.HEADER || text.textType === PlainTextTypes.FOOTER;
