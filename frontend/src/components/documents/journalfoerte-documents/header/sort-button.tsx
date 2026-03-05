import type { ArchivedDocumentsSort, ArchivedDocumentsSortColumn } from '@app/hooks/settings/use-setting';
import { SortOrder } from '@app/types/sort';
import { ArrowsUpDownIcon, SortDownIcon, SortUpIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps } from '@navikt/ds-react';

export interface SortButtonProps {
  column: ArchivedDocumentsSortColumn;
  sort: ArchivedDocumentsSort;
  setSort: (sort: ArchivedDocumentsSort) => void;
  size?: ButtonProps['size'];
}

export const SortButton = ({ column, sort, setSort, size }: SortButtonProps) => (
  <Button
    data-color="neutral"
    icon={getSortIcon(sort, column)}
    variant="tertiary"
    size={size}
    onClick={() =>
      setSort({
        order: column === sort.orderBy && sort.order === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC,
        orderBy: column,
      })
    }
  />
);

const getSortIcon = (sort: ArchivedDocumentsSort, column: ArchivedDocumentsSortColumn) => {
  if (sort.orderBy === column) {
    return sort.order === 'desc' ? <SortDownIcon aria-hidden /> : <SortUpIcon aria-hidden />;
  }

  return <ArrowsUpDownIcon aria-hidden />;
};
