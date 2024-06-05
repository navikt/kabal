import { Loader } from '@navikt/ds-react';
import { useMemo } from 'react';
import { useParams } from 'react-router';
import { styled } from 'styled-components';
import { PublishedRichText } from '@app/components/maltekstseksjoner/texts/published-rich-text';
import { Changelog } from '@app/components/smart-editor-texts/edit/changelog';
import { DraftRegelverk } from '@app/components/smart-editor-texts/edit/draft-regelverk';
import { DraftGodFormulering, DraftRichText } from '@app/components/smart-editor-texts/edit/draft-rich-text';
import { PublishedPlainText } from '@app/components/smart-editor-texts/edit/published-plain-text';
import { Tags } from '@app/components/smart-editor-texts/edit/tags';
import { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { UnpublishTextButton } from '@app/components/smart-editor-texts/unpublish-text-button';
import { VersionTabs } from '@app/components/versioned-tabs/versioned-tabs';
import { isGodFormulering, isRegelverk, isRichText } from '@app/functions/is-rich-plain-text';
import { useNavigateToStandaloneTextVersion } from '@app/hooks/use-navigate-to-standalone-text-version';
import { useGetTextByIdQuery, useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { PlainTextTypes, REGELVERK_TYPE, TextTypes } from '@app/types/common-text-types';
import { IDraft, IPlainText, IPublishedText, IText } from '@app/types/texts/responses';
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
  const navigate = useNavigateToStandaloneTextVersion(textType !== REGELVERK_TYPE);
  const publishedVersion = useMemo(() => versions.find(({ published }) => published), [versions]);
  const { versionId } = useParams();

  const version = publishedVersion ?? firstText;

  const onDraftDeleted = () =>
    navigate(
      publishedVersion?.versionId === undefined
        ? { id: null, versionId: null }
        : { id, versionId: publishedVersion.versionId },
    );

  const navigateToVersion = (vId: string) => navigate({ id, versionId: vId });

  const hasDraft = versions.some((v) => 'publishedDateTime' in v && v.publishedDateTime === null);

  return (
    <Container>
      <Header>
        <Changelog versions={versions} />
        <UnpublishTextButton {...version} id={id} textType={textType} />
      </Header>

      <StyledVersionTabs<IDraft, IPublishedText>
        first={firstText}
        versions={versions}
        selectedTabId={versionId}
        setSelectedTabId={navigateToVersion}
        createDraftPanel={(v) => <DraftVersion text={v} onDraftDeleted={onDraftDeleted} />}
        createPublishedPanel={(v) => (
          <PublishedVersion text={v} setVersionTabId={navigateToVersion} hasDraft={hasDraft} />
        )}
      />
    </Container>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  padding-bottom: 0;
`;

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
  setVersionTabId: (versionId: string) => void;
  hasDraft: boolean;
}

const PublishedVersion = ({ text, setVersionTabId, hasDraft }: PublishedVersionProps) => {
  if (isPlainText(text)) {
    return <PublishedPlainText text={text} onDraftCreated={setVersionTabId} hasDraft={hasDraft} />;
  }

  return (
    <PublishedContainer>
      <Tags {...text} />

      <PublishedRichText text={text} onDraftCreated={setVersionTabId} hasDraft={hasDraft} />
    </PublishedContainer>
  );
};

const isPlainText = (text: IText): text is IPlainText =>
  text.textType === PlainTextTypes.HEADER || text.textType === PlainTextTypes.FOOTER;

const Container = styled.div`
  display: flex;
  height: 100%;
  overflow-y: hidden;
  flex-direction: column;
`;

const StyledVersionTabs: typeof VersionTabs = styled(VersionTabs)`
  overflow: hidden;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const PublishedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  height: 100%;
`;
