import { Loader, ToggleGroup } from '@navikt/ds-react';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { styled } from 'styled-components';
import { PublishedRichText } from '@app/components/maltekstseksjoner/texts/published-rich-text';
import { PublishedPlainText } from '@app/components/smart-editor-texts/edit/published-plain-text';
import { Tags } from '@app/components/smart-editor-texts/edit/tags';
import { DraftVersionProps } from '@app/components/smart-editor-texts/types';
import { UnpublishTextButton } from '@app/components/smart-editor-texts/unpublish-text-button';
import { VersionTabs } from '@app/components/versioned-tabs/versioned-tabs';
import { useNavigateToStandaloneTextVersion } from '@app/hooks/use-navigate-to-standalone-text-version';
import { useGetTextByIdQuery, useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { PlainTextTypes } from '@app/types/common-text-types';
import { Language, isLanguage } from '@app/types/texts/language';
import {
  IDraftPlainText,
  IDraftRichText,
  IPlainText,
  IPublishedPlainText,
  IPublishedRichText,
  IText,
} from '@app/types/texts/responses';
import { DraftPlainText } from './draft-plain-text';
import { DraftRichText } from './draft-rich-text';

interface Props {
  id: string;
}

export const StandaloneTextVersions = ({ id }: Props) => {
  // TODO: use router instead
  const { data } = useGetTextByIdQuery(id);
  const [language, setLanguage] = useState<Language>(Language.NB);
  const { data: populatedVersions = [] } = useGetTextVersionsQuery({ id, language });

  if (data === undefined) {
    return <Loader />;
  }

  const [first] = populatedVersions;

  if (first === undefined) {
    return <p>Ingen tekst med ID {id}</p>;
  }

  return (
    <>
      <ToggleGroup
        value={language}
        onChange={(value) => {
          if (isLanguage(value)) {
            setLanguage(value);
          }
        }}
      >
        <ToggleGroup.Item value={Language.NB}>Bokmål</ToggleGroup.Item>
        <ToggleGroup.Item value={Language.NN}>Nynorsk</ToggleGroup.Item>
      </ToggleGroup>

      <VersionsLoaded versions={populatedVersions} firstText={first} id={id} />
    </>
  );
};

interface VersionsLoadedProps {
  versions: IText[];
  firstText: IText;
  id: string;
}

const VersionsLoaded = ({ versions, firstText, id }: VersionsLoadedProps) => {
  const navigate = useNavigateToStandaloneTextVersion();
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

  return (
    <Container>
      <UnpublishTextButton {...version} id={id} />

      <StyledVersionTabs<IDraftPlainText | IDraftRichText, IPublishedPlainText | IPublishedRichText>
        first={firstText}
        versions={versions}
        selectedTabId={versionId}
        setSelectedTabId={navigateToVersion}
        createDraftPanel={(v) => <DraftVersion text={v} onDraftDeleted={onDraftDeleted} />}
        createPublishedPanel={(v) => <PublishedVersion text={v} setVersionTabId={navigateToVersion} />}
      />
    </Container>
  );
};

const DraftVersion = ({ text, ...rest }: DraftVersionProps) =>
  isPlainText(text) ? <DraftPlainText text={text} {...rest} /> : <DraftRichText text={text} {...rest} />;

interface PublishedVersionProps {
  text: IPublishedPlainText | IPublishedRichText;
  setVersionTabId: (versionId: string) => void;
}

const PublishedVersion = ({ text, setVersionTabId }: PublishedVersionProps) => {
  if (isPlainText(text)) {
    return <PublishedPlainText text={text} onDraftCreated={setVersionTabId} />;
  }

  return (
    <PublishedContainer>
      <Tags {...text} />

      <PublishedRichText text={text} onDraftCreated={setVersionTabId} />
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
