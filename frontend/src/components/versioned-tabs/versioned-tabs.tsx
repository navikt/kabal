import { DocPencilIcon, FileTextIcon, FolderFileIcon } from '@navikt/aksel-icons';
import { Tabs } from '@navikt/ds-react';
import { useEffect } from 'react';
import { styled } from 'styled-components';
import { TabLabel } from '@app/components/versioned-tabs/tab-label';

interface DraftVersion {
  versionId: string;
  published: false;
  publishedDateTime: null;
}

interface PublishedVersion {
  versionId: string;
  published: boolean;
  publishedDateTime: string;
}

interface Props<D extends DraftVersion, P extends PublishedVersion> {
  first: D | P;
  versions: (D | P)[];
  selectedTabId: string | undefined;
  setSelectedTabId: (tabId: string, replace?: boolean) => void;
  createDraftPanel: (version: D) => React.ReactNode;
  createPublishedPanel: (version: P) => React.ReactNode;
  className?: string;
  setRef?: (ref: HTMLDivElement | null) => void;
}

export const VersionTabs = <D extends DraftVersion, P extends PublishedVersion>(props: Props<D, P>) => {
  const { selectedTabId, setSelectedTabId, first, versions, createDraftPanel, createPublishedPanel, setRef, ...rest } =
    props;

  useEffect(() => {
    if (selectedTabId === undefined) {
      setSelectedTabId(first.versionId, true);
    }
  }, [first.versionId, selectedTabId, setSelectedTabId]);

  const { length } = versions;
  const tabs = new Array<React.ReactNode>(length);
  const panels = new Array<React.ReactNode>(length);

  for (let i = length; i >= 0; i--) {
    const version = versions[i];

    if (version === undefined) {
      continue;
    }

    const { versionId, published, publishedDateTime } = version;
    const isDraft = publishedDateTime === null;

    const label = (
      <TabLabel isPublished={published} isDraft={isDraft}>
        {length - i}
      </TabLabel>
    );

    tabs[i] = <Tabs.Tab key={versionId} value={versionId} label={label} icon={getIcon(isDraft, published)} />;

    panels[i] = (
      <StyledTabPanel key={versionId} value={versionId}>
        {isDraft ? createDraftPanel(version) : createPublishedPanel(version)}
      </StyledTabPanel>
    );
  }

  return (
    <Tabs size="small" value={selectedTabId} onChange={setSelectedTabId} {...rest} ref={setRef}>
      <StyledTabList>{tabs}</StyledTabList>
      {panels}
    </Tabs>
  );
};

const DRAFT_ICON = <DocPencilIcon aria-hidden />;
const PUBLISHED_ICON = <FileTextIcon aria-hidden />;
const ARCHIVED_ICON = <FolderFileIcon aria-hidden />;

const getIcon = (isDraft: boolean, published: boolean) => {
  if (published) {
    return PUBLISHED_ICON;
  }

  if (isDraft) {
    return DRAFT_ICON;
  }

  return ARCHIVED_ICON;
};

const StyledTabPanel = styled(Tabs.Panel)`
  display: flex;
  overflow-y: auto;
  flex-direction: column;

  &[data-state='active'] {
    flex-grow: 1;
  }
`;

const StyledTabList = styled(Tabs.List)`
  white-space: nowrap;
`;
