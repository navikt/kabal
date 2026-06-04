import { ChevronRightIcon, ClockDashedIcon, FloppydiskIcon } from '@navikt/aksel-icons';
import { BodyLong, Box, Button, Heading, HelpText, HStack, Loader, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useMemo, useState } from 'react';
import { entryKey } from '@/components/smart-editor/history/entry-key';
import { HistoryEditor } from '@/components/smart-editor/history/history-editor';
import { type ApiHistoryEntry, type HistoryEntry, HistorySource } from '@/components/smart-editor/history/types';
import { useLocalHistory } from '@/components/smart-editor/history/use-local-history';
import { isoDateTimeToPretty } from '@/domain/date';
import { formatEmployeeNameAndIdFallback } from '@/domain/employee-name';
import type { KabalValue } from '@/plate/types';
import {
  useGetSmartDocumentVersionQuery,
  useGetSmartDocumentVersionsQuery,
} from '@/redux-api/oppgaver/queries/documents';
import type { ISmartDocumentOrAttachment } from '@/types/documents/documents';

interface Props {
  oppgaveId: string;
  smartDocument: ISmartDocumentOrAttachment;
}

export const History = ({ smartDocument, oppgaveId }: Props) => {
  const dokumentId = smartDocument.id;
  const {
    data: versions,
    isLoading: isLoadingVersions,
    isError: isVersionsError,
  } = useGetSmartDocumentVersionsQuery({ oppgaveId, dokumentId });
  const localEntries = useLocalHistory(oppgaveId, dokumentId);

  const allEntries = useMemo<HistoryEntry[]>(() => {
    const apiEntries = (versions ?? []).map<ApiHistoryEntry>(({ version, author, timestamp }) => ({
      source: HistorySource.API,
      version,
      author,
      timestamp,
    }));

    return [...apiEntries, ...localEntries].toSorted((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [versions, localEntries]);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Reset selection when the document changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: dokumentId is used as a reset trigger, not inside the callback.
  useEffect(() => {
    setSelectedKey(null);
  }, [dokumentId]);

  const selectedEntry = useMemo(
    () => allEntries.find((entry) => entryKey(entry) === selectedKey) ?? null,
    [allEntries, selectedKey],
  );

  const { data: apiContent } = useGetSmartDocumentVersionQuery(
    selectedEntry?.source === HistorySource.API
      ? { oppgaveId, dokumentId, versionId: selectedEntry.version }
      : skipToken,
  );

  const resolvedContent = resolveContent(selectedEntry, apiContent);

  const isEmpty = allEntries.length === 0;

  return (
    <>
      <VStack align="center" marginBlock="space-0 space-1" minWidth="300px" top="space-0" position="sticky">
        <HStack align="center" flexShrink="0" width="100%" wrap={false} paddingBlock="space-24 space-20">
          <div className="flex flex-nowrap gap-2">
            <Heading level="1" size="xsmall">
              Tidligere versjoner
            </Heading>

            <HelpText>
              <Heading level="2" size="xsmall" spacing>
                Lokale versjoner
              </Heading>
              <BodyLong size="small" spacing>
                Lokale versjoner lagres i nettleseren din og er ikke synlig for andre.
              </BodyLong>
              <BodyLong size="small">
                De opprettes automatisk mens du jobber, og kan være nyttige for å gjenopprette arbeid hvis noe skulle gå
                galt i Kabal.
              </BodyLong>
            </HelpText>
          </div>
        </HStack>
        <VStack
          asChild
          overflowY="auto"
          overflowX="hidden"
          margin="space-0"
          padding="space-0"
          gap="space-8 space-0"
          width="100%"
        >
          <Box as="ul" shadow="dialog" borderRadius="4" background="default" style={{ whiteSpace: 'nowrap' }}>
            {allEntries.map((entry) => (
              <HistoryItem
                key={entryKey(entry)}
                entry={entry}
                setSelectedKey={setSelectedKey}
                isActive={selectedKey === entryKey(entry)}
              />
            ))}
            {isLoadingVersions ? (
              <li className="flex justify-center p-2">
                <Loader size="small" title="Laster tidligere versjoner" />
              </li>
            ) : null}
            {isVersionsError ? (
              <li className="p-2 text-ax-text-danger">Kunne ikke hente versjoner fra server</li>
            ) : null}
            {isEmpty && !isLoadingVersions && !isVersionsError ? <li className="p-2">Ingen versjoner</li> : null}
          </Box>
        </VStack>
      </VStack>
      {selectedEntry !== null && resolvedContent !== undefined ? (
        <HistoryEditor smartDocument={smartDocument} entry={selectedEntry} version={resolvedContent} />
      ) : null}
    </>
  );
};

const resolveContent = (entry: HistoryEntry | null, apiContent: KabalValue | undefined): KabalValue | undefined => {
  if (entry === null) {
    return undefined;
  }

  return entry.source === HistorySource.API ? apiContent : entry.content;
};

interface HistoryItemProps {
  entry: HistoryEntry;
  isActive: boolean;
  setSelectedKey: (key: string) => void;
}

const HistoryItem = ({ entry, isActive, setSelectedKey }: HistoryItemProps) => {
  const { author, timestamp } = entry;

  return (
    <li>
      <Button
        variant={isActive ? 'tertiary' : 'tertiary-neutral'}
        onClick={() => setSelectedKey(entryKey(entry))}
        size="xsmall"
        iconPosition="right"
        icon={<ChevronRightIcon aria-hidden />}
        className="flex w-full justify-between p-2 text-left"
      >
        {entry.source === HistorySource.API ? (
          <Tag data-color="info" variant="outline" size="xsmall">
            <ClockDashedIcon aria-hidden /> Versjon: {entry.version}
          </Tag>
        ) : (
          <Tag data-color="warning" variant="outline" size="xsmall">
            <FloppydiskIcon aria-hidden /> Lokal
          </Tag>
        )}
        <div className="font-ax-bold">{formatEmployeeNameAndIdFallback(author, 'System')}</div>
        <div className="text-ax-small italic">{isoDateTimeToPretty(timestamp)}</div>
      </Button>
    </li>
  );
};
