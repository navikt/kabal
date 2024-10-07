import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { VersionTabs } from '@app/components/versioned-tabs/versioned-tabs';
import { ScalingGroup } from '@app/hooks/settings/use-setting';
import { useNavigateMaltekstseksjoner } from '@app/hooks/use-navigate-maltekstseksjoner';
import { getScaleVar } from '@app/plate/status-bar/scale-context';
import { useGetMaltekstseksjonVersionsQuery } from '@app/redux-api/maltekstseksjoner/queries';
import { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import {
  IDraftMaltekstseksjon,
  IMaltekstseksjon,
  IPublishedMaltekstseksjon,
} from '@app/types/maltekstseksjoner/responses';
import { DraftMaltekstSection } from './draft/draft';
import { PublishedMaltekstSection } from './maltekstseksjon-published';

interface Props {
  id: string;
  query: IGetMaltekstseksjonParams;
}

export const MaltekstseksjonVersions = ({ id, query }: Props) => {
  const { data: versions, isLoading } = useGetMaltekstseksjonVersionsQuery(id);

  if (isLoading || versions === undefined) {
    return null;
  }

  if (versions.length === 0) {
    return null;
  }

  const [first] = versions;

  if (first === undefined) {
    return null;
  }

  return <Loaded versions={versions} first={first} query={query} />;
};

interface LoadedProps {
  versions: IMaltekstseksjon[];
  first: IMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
}

const Loaded = ({ versions, first, query }: LoadedProps) => {
  const setPath = useNavigateMaltekstseksjoner();

  const onDraftDeleted = useCallback(() => {
    const firstPublished = versions.find((version) => version.published);

    setPath({ maltekstseksjonVersionId: firstPublished?.versionId ?? null, textId: null });
  }, [setPath, versions]);

  const { maltekstseksjonVersionId } = useParams();

  const setSelectedTabId = useCallback(
    (versionId: string) => {
      setPath({ maltekstseksjonVersionId: versionId });
    },
    [setPath],
  );

  const onDraftCreated = useCallback(
    (versionId: string) => {
      setPath({ maltekstseksjonVersionId: versionId });
    },
    [setPath],
  );

  useEffect(() => {
    if (maltekstseksjonVersionId === undefined) {
      setPath({ maltekstseksjonVersionId: first.versionId }, true);
    }
  }, [first.versionId, maltekstseksjonVersionId, setPath]);

  return (
    <StyledVersionTabs<IDraftMaltekstseksjon, IPublishedMaltekstseksjon>
      first={first}
      selectedTabId={maltekstseksjonVersionId}
      setSelectedTabId={setSelectedTabId}
      versions={versions}
      createDraftPanel={(version) => (
        <PanelContent style={{ [EDITOR_SCALE_CSS_VAR.toString()]: getScaleVar(ScalingGroup.REDAKTØR) }}>
          <DraftMaltekstSection maltekstseksjon={version} query={query} onDraftDeleted={onDraftDeleted} />
        </PanelContent>
      )}
      createPublishedPanel={(version) => (
        <PanelContent style={{ [EDITOR_SCALE_CSS_VAR.toString()]: getScaleVar(ScalingGroup.REDAKTØR) }}>
          <PublishedMaltekstSection maltekstseksjon={version} query={query} onDraftCreated={onDraftCreated} />
        </PanelContent>
      )}
    />
  );
};

const PanelContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 8px;
  flex-grow: 1;
`;

const StyledVersionTabs: typeof VersionTabs = styled(VersionTabs)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
  width: fit-content;
`;
