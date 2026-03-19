import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import { DateFilter } from '@/components/documents/journalfoerte-documents/header/date-filter';
import type { useFilters } from '@/components/documents/journalfoerte-documents/header/use-filters';
import { ArchivedDocumentsColumn } from '@/hooks/settings/use-archived-documents-setting';
import { useDocumentsFilterDatoSortering } from '@/hooks/settings/use-setting';

interface Props extends Pick<ReturnType<typeof useFilters>, 'sort' | 'setSort'> {}

export const DatoSortering = (props: Props) => {
  const datoSorteringSetting = useDocumentsFilterDatoSortering();

  return (
    <DateFilter
      {...datoSorteringSetting}
      {...props}
      label="Dato reg./sendt"
      gridArea={Fields.DatoSortering}
      column={ArchivedDocumentsColumn.DATO_SORTERING}
      size="small"
    />
  );
};
