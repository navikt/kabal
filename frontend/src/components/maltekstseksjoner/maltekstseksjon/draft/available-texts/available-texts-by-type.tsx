import { Box, HStack, Loader, Search, Table, VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Body } from '@/components/maltekstseksjoner/maltekstseksjon/draft/available-texts/body';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { SetMaltekstseksjonLanguage } from '@/components/set-redaktoer-language/set-maltekstseksjon-language';
import { fuzzySearch } from '@/components/smart-editor/gode-formuleringer/fuzzy-search';
import { splitQuery } from '@/components/smart-editor/gode-formuleringer/split-query';
import {
  DEFAULT_STATUSES,
  filterByStatus,
  STATUS_OPTIONS,
  type Status,
  type StatusOption,
} from '@/components/smart-editor-texts/status-filter/status-filter';
import { useRedaktoerLanguage } from '@/hooks/use-redaktoer-language';
import { getTextAsString } from '@/plate/functions/get-text-string';
import { useGetTextsQuery } from '@/redux-api/texts/queries';
import { RichTextTypes } from '@/types/common-text-types';
import type { ListRichText } from '@/types/texts/common';
import type { IRichText, IText, ListText } from '@/types/texts/responses';

export interface AvailableTextsByTypeProps {
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  usedIds: string[];
  textType: RichTextTypes.MALTEKST | RichTextTypes.REDIGERBAR_MALTEKST;
}

export const AvailableTextsByType = ({ onAdd, onRemove, usedIds, textType }: AvailableTextsByTypeProps) => {
  const { data = [], isFetching } = useGetTextsQuery({ textType });
  const [sort, setSort] = useState<SortState>({ orderBy: SortKey.SCORE, direction: SortDirection.DESCENDING });
  const [filter, setFilter] = useState<string>('');
  const lang = useRedaktoerLanguage();
  const [filteredStatuses, setFilteredStatuses] = useState<Status[]>(DEFAULT_STATUSES);

  const selectedStatusOptions = useMemo(
    () => STATUS_OPTIONS.filter((o) => filteredStatuses.includes(o.value)),
    [filteredStatuses],
  );

  const handleStatusChange = useCallback(
    (options: StatusOption[]) => setFilteredStatuses(options.map((o) => o.value)),
    [],
  );

  const onSortChange = useCallback(
    (sortKey: string | undefined) => {
      if (sortKey === undefined) {
        setSort({ orderBy: SortKey.MODIFIED, direction: SortDirection.DESCENDING });
      } else if (sortKey === sort.orderBy) {
        setSort({
          orderBy: sortKey,
          direction: sort.direction === SortDirection.ASCENDING ? SortDirection.DESCENDING : SortDirection.ASCENDING,
        });
      } else {
        setSort({ orderBy: sortKey, direction: SortDirection.DESCENDING });
      }
    },
    [sort],
  );

  const filteredAndSortedData = useMemo(() => {
    const filtered: ScoredRichText[] = [];

    const hasTextFilter = filter.length > 0;

    for (const text of data) {
      if (!isRichtext(text) || !filterByStatus(filteredStatuses, text)) {
        continue;
      }

      if (hasTextFilter) {
        const filterText = text.title + (getTextAsString(text.richText[lang] ?? []) ?? '');

        const score = fuzzySearch(splitQuery(filter), filterText);

        if (score > 0) {
          filtered.push({ ...text, score });
        }
      } else {
        filtered.push({ ...text, score: 100 });
      }
    }

    if (sort.orderBy === SortKey.SCORE) {
      if (sort.direction === SortDirection.ASCENDING) {
        return filtered.sort((a, b) => a.score - b.score);
      }

      return filtered.sort((a, b) => b.score - a.score);
    }

    if (sort.orderBy === SortKey.MODIFIED) {
      if (sort.direction === SortDirection.ASCENDING) {
        return filtered.sort((a, b) => a.modified.localeCompare(b.modified));
      }

      return filtered.sort((a, b) => b.modified.localeCompare(a.modified));
    }

    if (sort.orderBy === SortKey.REFERENCES) {
      if (sort.direction === SortDirection.ASCENDING) {
        return filtered.sort(
          (a, b) =>
            a.draftMaltekstseksjonIdList.length +
            a.publishedMaltekstseksjonIdList.length -
            (b.draftMaltekstseksjonIdList.length + b.publishedMaltekstseksjonIdList.length),
        );
      }

      return filtered.sort(
        (a, b) =>
          b.draftMaltekstseksjonIdList.length +
          b.publishedMaltekstseksjonIdList.length -
          (a.draftMaltekstseksjonIdList.length + a.publishedMaltekstseksjonIdList.length),
      );
    }

    return filtered;
  }, [data, filter, lang, sort, filteredStatuses]);

  return (
    <VStack gap="space-8" marginBlock="space-16 space-0" overflowY="hidden" height="75vh">
      <HStack gap="space-4">
        <Search
          value={filter}
          onChange={setFilter}
          placeholder="Filtrer på tittel eller innhold"
          label="Filtrer på tittel eller innhold"
          size="small"
          hideLabel
        />
        <SetMaltekstseksjonLanguage />
      </HStack>
      {isFetching ? (
        <Loader title="Laster..." />
      ) : (
        <Box position="relative" overflowY="auto" flexGrow="1">
          <Table size="small" zebraStripes onSortChange={onSortChange} sort={sort}>
            <Box asChild position="sticky" top="space-0" background="default" className="z-1">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Tittel</Table.HeaderCell>
                  <Table.ColumnHeader sortKey={SortKey.MODIFIED} sortable className="whitespace-nowrap">
                    Sist endret
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    sortKey={SortKey.REFERENCES}
                    sortable
                    title="Viser referanser til andre maltekstseksjoner som bruker denne teksten."
                  >
                    Maltekstseksjoner
                  </Table.ColumnHeader>
                  <Table.HeaderCell>
                    <SearchableMultiSelect
                      label="Status"
                      options={STATUS_OPTIONS}
                      value={selectedStatusOptions}
                      valueKey={statusValueKey}
                      formatOption={statusFormatOption}
                      emptyLabel="Status"
                      filterText={statusFilterText}
                      onChange={handleStatusChange}
                      triggerSize="small"
                      triggerVariant="tertiary"
                      showSelectAll
                    />
                  </Table.HeaderCell>
                  <Table.ColumnHeader>%</Table.ColumnHeader>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
            </Box>
            <Body texts={filteredAndSortedData} onAdd={onAdd} onRemove={onRemove} usedIds={usedIds} />
          </Table>
        </Box>
      )}
    </VStack>
  );
};

interface SortState {
  orderBy: string;
  direction: SortDirection;
}

enum SortDirection {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

enum SortKey {
  MODIFIED = 'modified',
  REFERENCES = 'references',
  SCORE = 'score',
}

type ScoredRichText = ListRichText & { score: number };

const isRichtext = (text: IText | ListText): text is IRichText =>
  text.textType === RichTextTypes.MALTEKST || text.textType === RichTextTypes.REDIGERBAR_MALTEKST;

const statusValueKey = (option: StatusOption): string => option.value;
const statusFormatOption = (option: StatusOption): ReactNode => option.label;
const statusFilterText = (option: StatusOption): string => option.label;
