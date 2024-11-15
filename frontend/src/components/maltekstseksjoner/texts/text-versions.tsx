import { VersionTabs } from '@app/components/versioned-tabs/versioned-tabs';
import { useGetTextVersionsQuery } from '@app/redux-api/texts/queries';
import { RichTextTypes } from '@app/types/common-text-types';
import { isApiError } from '@app/types/errors';
import type { IDraftRichText, IPublishedRichText, IRichText, IText } from '@app/types/texts/responses';
import { Alert, Loader } from '@navikt/ds-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PublishedRichText } from './published-rich-text';
import { DraftText } from './text-draft/text-draft';

interface Props {
  textId: string;
  isActive: boolean;
  setActive: (textId: string) => void;
  maltekstseksjonId: string;
  className?: string;
}

export const TextVersions = ({ textId, className, ...rest }: Props) => {
  const { data: versions, isLoading: versionsIsLoading, isError, error } = useGetTextVersionsQuery(textId);

  if (isError) {
    return (
      <div className={className}>
        <Alert variant="error" inline size="small">
          Feil ved lasting: {'data' in error && isApiError(error.data) ? error.data.detail : 'Ukjent feil'}
        </Alert>
      </div>
    );
  }

  if (versionsIsLoading || versions === undefined) {
    return (
      <div className={className}>
        <Loader />
      </div>
    );
  }

  const validVersions = versions.filter(isValidType);

  const [firstVersion] = validVersions;

  if (firstVersion === undefined) {
    return <p>Ingen tekst med ID {textId}</p>;
  }

  return (
    <Loaded firstVersion={firstVersion} versions={validVersions} textId={textId} className={className} {...rest} />
  );
};

const isValidType = (text: IText): text is IRichText =>
  text.textType === RichTextTypes.MALTEKST || text.textType === RichTextTypes.REDIGERBAR_MALTEKST;

interface LoadedProps extends Props {
  firstVersion: IRichText;
  versions: IRichText[];
}

const Loaded = ({ firstVersion, versions, isActive, className, ...props }: LoadedProps) => {
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const [tabId, setTabId] = useState(firstVersion.versionId);

  useEffect(() => {
    if (isActive && tabsContainerRef.current !== null) {
      setTimeout(() => {
        if (tabsContainerRef.current !== null) {
          tabsContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [isActive]);

  const onDraftDeleted = useCallback(() => {
    const publishedVersion = versions.find((v) => v.publishedDateTime !== null);

    if (publishedVersion !== undefined) {
      setTabId(publishedVersion?.versionId);
    }
  }, [versions]);

  const hasMoreThanOneVersion = versions.length > 1;
  const hasDraft = versions.some((v) => v.publishedDateTime === null);

  return (
    <VersionTabs<IDraftRichText, IPublishedRichText>
      className={className}
      first={firstVersion}
      versions={versions}
      selectedTabId={tabId}
      setSelectedTabId={setTabId}
      setRef={(ref) => {
        tabsContainerRef.current = ref;
      }}
      createDraftPanel={(version) => (
        <DraftText
          key={version.versionId}
          {...props}
          isActive={isActive}
          text={version}
          isDeletable={hasMoreThanOneVersion}
          onDraftDeleted={onDraftDeleted}
        />
      )}
      createPublishedPanel={(version) => (
        <PublishedRichText key={version.versionId} {...props} text={version} hasDraft={hasDraft} />
      )}
    />
  );
};
