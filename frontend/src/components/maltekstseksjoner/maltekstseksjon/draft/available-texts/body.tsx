import { StatusTag } from '@app/components/maltekstseksjoner/status-tag';
import { isoDateTimeToPretty } from '@app/domain/date';
import type { ListRichText } from '@app/types/texts/common';
import { Button, Table } from '@navikt/ds-react';
import { useMemo } from 'react';
import { Row } from './row';

type ScoredText = ListRichText & { score: number };

interface Props {
  texts: ScoredText[];
  usedIds: string[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}

export const Body = ({ texts, usedIds, onAdd, onRemove }: Props) => {
  const rows = useMemo(
    () =>
      texts.map(
        ({
          title,
          modified,
          id,
          draftMaltekstseksjonIdList,
          publishedMaltekstseksjonIdList,
          score,
          published,
          publishedDateTime,
        }) => {
          const isUsed = usedIds.includes(id);

          return (
            <Row
              key={id}
              textId={id}
              draftMaltekstseksjonIdList={draftMaltekstseksjonIdList}
              publishedMaltekstseksjonIdList={publishedMaltekstseksjonIdList}
            >
              <Table.HeaderCell>{title.length === 0 ? '<Ingen tittel>' : title}</Table.HeaderCell>
              <Table.DataCell>
                <time dateTime={modified}>{isoDateTimeToPretty(modified)}</time>
              </Table.DataCell>
              <Table.DataCell>
                <RefCount
                  draftMaltekstseksjonIdList={draftMaltekstseksjonIdList}
                  publishedMaltekstseksjonIdList={publishedMaltekstseksjonIdList}
                />
              </Table.DataCell>
              <Table.DataCell>
                <StatusTag publishedDateTime={publishedDateTime} published={published} />
              </Table.DataCell>
              <Table.DataCell>{score.toFixed(2)} %</Table.DataCell>
              <Table.DataCell>
                <Button size="xsmall" variant="tertiary" onClick={() => (isUsed ? onRemove(id) : onAdd(id))}>
                  {isUsed ? 'Fjern' : 'Legg til'}
                </Button>
              </Table.DataCell>
            </Row>
          );
        },
      ),
    [texts, usedIds, onRemove, onAdd],
  );

  return <Table.Body>{rows}</Table.Body>;
};

interface RefCountProps {
  draftMaltekstseksjonIdList: string[];
  publishedMaltekstseksjonIdList: string[];
}

const RefCount = ({ draftMaltekstseksjonIdList, publishedMaltekstseksjonIdList }: RefCountProps) => {
  const refCount = draftMaltekstseksjonIdList.length + publishedMaltekstseksjonIdList.length;

  if (refCount === 0) {
    return <span>Ingen maltekstseksjoner</span>;
  }

  if (refCount === 1) {
    return <span>1 maltekstseksjon</span>;
  }

  return <span>{refCount} maltekstseksjoner</span>;
};
