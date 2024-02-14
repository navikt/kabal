import { PadlockLockedIcon, PencilWritingIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Loader, Modal, Search, Table } from '@navikt/ds-react';
import React, { useCallback, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { useGetTextsQuery } from '@app/redux-api/texts/queries';
import { RichTextTypes } from '@app/types/common-text-types';
import { IRichText, IText } from '@app/types/texts/responses';
import { Body } from './body';

interface Props {
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  usedIds: string[];
  textType: RichTextTypes.MALTEKST | RichTextTypes.REDIGERBAR_MALTEKST;
}

export const AvailableTexts = ({ onAdd, onRemove, usedIds, textType }: Props) => {
  const Icon = textType === RichTextTypes.MALTEKST ? PadlockLockedIcon : PencilWritingIcon;

  const typeLabel = textType === RichTextTypes.MALTEKST ? 'Låste' : 'Redigerbare';
  const [open, setOpen] = useState(false);

  const onClose = useCallback(() => setOpen(false), []);

  return (
    <div>
      <Button variant="tertiary" size="small" onClick={() => setOpen(!open)} icon={<Icon aria-hidden />}>
        {typeLabel}
      </Button>

      <Modal
        header={{ heading: typeLabel + ' tekster' }}
        width={1200}
        open={open}
        onClose={onClose}
        closeOnBackdropClick
      >
        <Modal.Body>
          {/* Ensures JIT loading */}
          {open ? (
            <AvailableTextsByType onAdd={onAdd} onRemove={onRemove} usedIds={usedIds} textType={textType} />
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button size="small" variant="secondary" onClick={onClose} icon={<XMarkIcon aria-hidden />}>
            Lukk
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

interface AvailableTextsByTypeProps extends Props {
  textType: RichTextTypes.MALTEKST | RichTextTypes.REDIGERBAR_MALTEKST;
}
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
}

const AvailableTextsByType = ({ onAdd, onRemove, usedIds, textType }: AvailableTextsByTypeProps) => {
  const { data = [], isFetching } = useGetTextsQuery({ textType });
  const [sort, setSort] = useState<SortState>({ orderBy: SortKey.MODIFIED, direction: SortDirection.DESCENDING });
  const [filter, setFilter] = useState<string>('');

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
    const filterRegex = stringToRegExp(filter);
    const filtered = filter.length === 0 ? richTexts : richTexts.filter(({ title }) => filterRegex.test(title));

    if (sort === undefined) {
      return filtered;
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
  }, [data, filter, sort]);

  return (
    <Container>
      <Search
        value={filter}
        onChange={setFilter}
        placeholder="Filtrer på tittel"
        label="Filtrer på tittel"
        size="small"
        hideLabel
      />
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
