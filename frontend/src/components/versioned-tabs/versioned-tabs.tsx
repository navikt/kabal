import { TabLabel } from '@app/components/versioned-tabs/tab-label';
import { DocPencilIcon, FileTextIcon, FolderFileIcon } from '@navikt/aksel-icons';
import { Tabs } from '@navikt/ds-react';
import { useEffect } from 'react';

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
      <Tabs.Panel
        key={versionId}
        value={versionId}
        lazy={false}
        className='flex flex-col overflow-y-auto data-[state="active"]:grow'
      >
        {isDraft ? createDraftPanel(version) : createPublishedPanel(version)}
      </Tabs.Panel>
    );
  }

  return (
    <Tabs
      size="small"
      value={selectedTabId}
      onChange={setSelectedTabId}
      {...rest}
      ref={setRef}
      className="flex grow flex-col overflow-hidden"
    >
      <Tabs.List className="w-[760px] whitespace-nowrap">{tabs}</Tabs.List>
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
