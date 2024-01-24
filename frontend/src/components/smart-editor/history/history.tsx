import { ChevronRightIcon, ClockDashedIcon } from '@navikt/aksel-icons';
import { Button, Heading, Loader, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import { HistoryEditor } from '@app/components/smart-editor/history/history-editor';
import { isoDateTimeToPretty } from '@app/domain/date';
import {
  useGetSmartDocumentVersionQuery,
  useGetSmartDocumentVersionsQuery,
} from '@app/redux-api/oppgaver/queries/documents';
import { ISmartDocument, ISmartDocumentVersion } from '@app/types/documents/documents';

interface Props {
  oppgaveId: string;
  smartDocument: ISmartDocument;
}

export const History = ({ smartDocument, oppgaveId }: Props) => {
  const dokumentId = smartDocument.id;
  const { data: versions } = useGetSmartDocumentVersionsQuery({ oppgaveId, dokumentId });

  if (versions === undefined) {
    return (
      <>
        <ListContainer>
          <ListHeader>
            <Heading level="1" size="xsmall">
              Tidligere versjoner
            </Heading>
          </ListHeader>
          <StyledHistory>
            <Loader />
          </StyledHistory>
        </ListContainer>
      </>
    );
  }

  if (!hasVersions(versions)) {
    return (
      <>
        <ListContainer>
          <ListHeader>
            <Heading level="1" size="xsmall">
              Tidligere versjoner
            </Heading>
          </ListHeader>
          <StyledHistory>
            <li>Ingen versioner</li>
          </StyledHistory>
        </ListContainer>
      </>
    );
  }

  return <LoadedHistory versions={versions} smartDocument={smartDocument} oppgaveId={oppgaveId} />;
};

type Versions = [ISmartDocumentVersion] & ISmartDocumentVersion[];

const hasVersions = (versions: ISmartDocumentVersion[]): versions is Versions => versions.length !== null;

interface LoadedHistoryProps extends Props {
  versions: Versions;
}

const LoadedHistory = ({ versions, smartDocument, oppgaveId }: LoadedHistoryProps) => {
  const dokumentId = smartDocument.id;
  const [firstVersion] = versions;
  const [selectedVersion, setSelectedVersion] = useState<number>(firstVersion.version);
  const { data: version } = useGetSmartDocumentVersionQuery(
    selectedVersion === null ? skipToken : { oppgaveId, dokumentId, versionId: selectedVersion },
  );

  return (
    <>
      <ListContainer>
        <ListHeader>
          <Heading level="1" size="xsmall">
            Tidligere versjoner
          </Heading>
        </ListHeader>
        <StyledHistory>
          {versions.map((v) => (
            <HistoryItem
              key={v.version}
              documentVersion={v}
              setSelectedVersion={setSelectedVersion}
              isActive={v.version === selectedVersion}
            />
          ))}
        </StyledHistory>
      </ListContainer>

      {selectedVersion === null || version === undefined ? null : (
        <HistoryEditor smartDocument={smartDocument} versionId={selectedVersion} version={version} />
      )}
    </>
  );
};

interface HistoryItemProps {
  documentVersion: ISmartDocumentVersion;
  isActive: boolean;
  setSelectedVersion: (id: number) => void;
}

const HistoryItem = ({ documentVersion, isActive, setSelectedVersion }: HistoryItemProps) => {
  const { version, timestamp, author } = documentVersion;

  return (
    <li>
      <StyledButton
        variant={isActive ? 'tertiary' : 'tertiary-neutral'}
        onClick={() => setSelectedVersion(version)}
        size="xsmall"
        iconPosition="right"
        icon={<ChevronRightIcon aria-hidden />}
      >
        <Tag variant="alt3" size="xsmall">
          <ClockDashedIcon aria-hidden /> Versjon: {version}
        </Tag>
        <StyledHistoryItemAuthor>
          {author === null ? 'Ukjent forfatter' : `${author.navn} (${author.navIdent})`}
        </StyledHistoryItemAuthor>
        <StyledHistoryItemTimestamp>{isoDateTimeToPretty(timestamp)}</StyledHistoryItemTimestamp>
      </StyledButton>
    </li>
  );
};

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
  margin-right: 16px;
  min-width: 300px;
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: 60px;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: space-between;
  text-align: left;
  width: 100%;
`;

const StyledHistory = styled.ul`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  row-gap: 8px;
  background-color: var(--a-surface-default);
  padding: var(--a-spacing-2);
  box-shadow: var(--a-shadow-medium);
  border-radius: var(--a-border-radius-medium);
  width: 100%;
`;

const StyledHistoryItemAuthor = styled.div`
  font-weight: bold;
`;

const StyledHistoryItemTimestamp = styled.div`
  font-size: 14px;
  font-style: italic;
`;
