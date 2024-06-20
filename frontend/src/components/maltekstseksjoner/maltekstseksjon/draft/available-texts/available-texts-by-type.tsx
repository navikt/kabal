import { Loader, Search, Table } from '@navikt/ds-react';
import { useCallback, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { SetMaltekstseksjonLanguage } from '@app/components/set-redaktoer-language/set-maltekstseksjon-language';
import { fuzzySearch } from '@app/components/smart-editor/gode-formuleringer/fuzzy-search';
import { splitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { useTrashQuery } from '@app/hooks/use-trash-query';
import { getTextAsString } from '@app/plate/functions/get-text-string';
import { useGetTextsQuery } from '@app/redux-api/texts/queries';
import { RichTextTypes } from '@app/types/common-text-types';
import { IRichText, IText } from '@app/types/texts/responses';
import { Body } from './body';

export interface AvailableTextsByTypeProps {
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  usedIds: string[];
  textType: RichTextTypes.MALTEKST | RichTextTypes.REDIGERBAR_MALTEKST;
}

export const AvailableTextsByType = ({ onAdd, onRemove, usedIds, textType }: AvailableTextsByTypeProps) => {
  const trash = useTrashQuery();
  const { data = [], isFetching } = useGetTextsQuery({ textType, trash });
  const [sort, setSort] = useState<SortState>({ orderBy: SortKey.SCORE, direction: SortDirection.DESCENDING });
  const [filter, setFilter] = useState<string>('');
  const lang = useRedaktoerLanguage();

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
    const richTexts = data.filter(isRichtext);
    let filtered: ScoredRichText[] = [];

    if (filter.length === 0) {
      filtered = richTexts.map((text) => ({ ...text, score: 100 }));
    } else {
      for (const text of richTexts) {
        const filterText = text.title + (getTextAsString(text.richText[lang] ?? []) ?? '');

        const score = fuzzySearch(splitQuery(filter), filterText);

        if (score > 0) {
          filtered.push({ ...text, score });
        }
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
  }, [data, filter, lang, sort]);

  return (
    <Container>
      <Row>
        <Search
          value={filter}
          onChange={setFilter}
          placeholder="Filtrer på tittel eller innhold"
          label="Filtrer på tittel eller innhold"
          size="small"
          hideLabel
        />
        <SetMaltekstseksjonLanguage />
      </Row>
      {isFetching ? (
        <Loader title="Laster..." />
      ) : (
        <TableWrapper>
          <Table size="small" zebraStripes onSortChange={onSortChange} sort={sort}>
            <StyledTableHeader>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Tittel</Table.HeaderCell>
                <Table.ColumnHeader sortKey={SortKey.MODIFIED} sortable>
                  Sist endret
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  sortKey={SortKey.REFERENCES}
                  sortable
                  title="Viser referanser til andre maltekstseksjoner som bruker denne teksten."
                >
                  Maltekstseksjoner
                </Table.ColumnHeader>
                <Table.ColumnHeader>%</Table.ColumnHeader>
                <Table.HeaderCell />
              </Table.Row>
            </StyledTableHeader>
            <Body texts={filteredAndSortedData} onAdd={onAdd} onRemove={onRemove} usedIds={usedIds} />
          </Table>
        </TableWrapper>
      )}
    </Container>
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

type ScoredRichText = IRichText & { score: number };

const isRichtext = (text: IText): text is IRichText =>
  text.textType === RichTextTypes.MALTEKST || text.textType === RichTextTypes.REDIGERBAR_MALTEKST;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  height: 75vh;
  overflow-y: hidden;
`;

const TableWrapper = styled.div`
  position: relative;
  overflow-y: auto;
`;

const StyledTableHeader = styled(Table.Header)`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--a-surface-default);
`;

const Row = styled.div`
  display: flex;
  gap: 4px;
`;
