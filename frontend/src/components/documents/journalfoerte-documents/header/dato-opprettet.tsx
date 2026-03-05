import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { DateFilter } from '@app/components/documents/journalfoerte-documents/header/date-filter';
import type { useFilters } from '@app/components/documents/journalfoerte-documents/header/use-filters';
import { ArchivedDocumentsColumn } from '@app/hooks/settings/use-archived-documents-setting';
import { useDocumentsFilterDatoOpprettet } from '@app/hooks/settings/use-setting';

interface Props extends Pick<ReturnType<typeof useFilters>, 'sort' | 'setSort'> {}

export const DatoOpprettet = (props: Props) => {
  const datoOpprettetSetting = useDocumentsFilterDatoOpprettet();

  return (
    <DateFilter
      {...datoOpprettetSetting}
      {...props}
      label="Dato opprettet"
      gridArea={Fields.DatoOpprettet}
      column={ArchivedDocumentsColumn.DATO_OPPRETTET}
      size="small"
    />
  );
};
