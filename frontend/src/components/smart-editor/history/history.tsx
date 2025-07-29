import { HistoryEditor } from '@app/components/smart-editor/history/history-editor';
import { isoDateTimeToPretty } from '@app/domain/date';
import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import {
  useGetSmartDocumentVersionQuery,
  useGetSmartDocumentVersionsQuery,
} from '@app/redux-api/oppgaver/queries/documents';
import type { ISmartDocumentOrAttachment, ISmartDocumentVersion } from '@app/types/documents/documents';
import { ChevronRightIcon, ClockDashedIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, Heading, HStack, Loader, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

interface Props {
  oppgaveId: string;
  smartDocument: ISmartDocumentOrAttachment;
}

export const History = ({ smartDocument, oppgaveId }: Props) => {
  const dokumentId = smartDocument.id;
  const { data: versions } = useGetSmartDocumentVersionsQuery({ oppgaveId, dokumentId });

  if (versions === undefined) {
    return (
      <VStack align="center" marginBlock="0 4" minWidth="300px" top="0" position="sticky">
        <HStack align="center" flexShrink="0" width="100%" wrap={false} paddingBlock="6 5">
          <Heading level="1" size="xsmall">
            Tidligere versjoner
          </Heading>
        </HStack>
        <VStack asChild overflowY="auto" overflowX="hidden" margin="0" padding="0" gap="2 0" width="100%">
          <BoxNew as="ul" shadow="dialog" borderRadius="medium" background="default" style={{ whiteSpace: 'nowrap' }}>
            <Loader />
          </BoxNew>
        </VStack>
      </VStack>
    );
  }

  if (!hasVersions(versions)) {
    return (
      <VStack align="center" marginBlock="0 4" minWidth="300px" top="0" position="sticky">
        <HStack align="center" flexShrink="0" width="100%" wrap={false} paddingBlock="6 5">
          <Heading level="1" size="xsmall">
            Tidligere versjoner
          </Heading>
        </HStack>
        <VStack asChild overflowY="auto" overflowX="hidden" margin="0" padding="0" gap="2 0" width="100%">
          <BoxNew as="ul" shadow="dialog" borderRadius="medium" background="default" style={{ whiteSpace: 'nowrap' }}>
            <li>Ingen versioner</li>
          </BoxNew>
        </VStack>
      </VStack>
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
      <VStack align="center" marginBlock="0 4" minWidth="300px" top="0" position="sticky">
        <HStack align="center" flexShrink="0" width="100%" wrap={false} paddingBlock="6 5">
          <Heading level="1" size="xsmall">
            Tidligere versjoner
          </Heading>
        </HStack>
        <VStack asChild overflowY="auto" overflowX="hidden" margin="0" padding="0" gap="2 0" width="100%">
          <BoxNew as="ul" shadow="dialog" borderRadius="medium" background="default" style={{ whiteSpace: 'nowrap' }}>
            {versions.map((v) => (
              <HistoryItem
                key={v.version}
                documentVersion={v}
                setSelectedVersion={setSelectedVersion}
                isActive={v.version === selectedVersion}
              />
            ))}
          </BoxNew>
        </VStack>
      </VStack>

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
      <Button
        variant={isActive ? 'tertiary' : 'tertiary-neutral'}
        onClick={() => setSelectedVersion(version)}
        size="xsmall"
        iconPosition="right"
        icon={<ChevronRightIcon aria-hidden />}
        className="flex w-full justify-between p-2 text-left"
      >
        <Tag variant="alt3" size="xsmall">
          <ClockDashedIcon aria-hidden /> Versjon: {version}
        </Tag>
        <div className="font-bold">{formatEmployeeNameAndIdFallback(author, 'Ukjent forfatter')}</div>
        <div className="text-ax-small italic">{isoDateTimeToPretty(timestamp)}</div>
      </Button>
    </li>
  );
};
