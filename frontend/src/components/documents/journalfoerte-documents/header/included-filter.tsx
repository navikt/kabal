import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { GRID_CLASSES } from '@app/components/documents/new-documents/grid';
import { useDocumentsOnlyIncluded } from '@app/hooks/settings/use-setting';
import { Checkbox, HStack } from '@navikt/ds-react';

export const IncludedFilter = () => {
  const { value = false, setValue } = useDocumentsOnlyIncluded();

  const title = value ? 'Viser kun inkluderte dokumenter.' : 'Viser alle dokumenter.';

  return (
    <HStack align="center" justify="center" className={GRID_CLASSES[Fields.Action]}>
      <Checkbox size="small" checked={value} hideLabel onChange={() => setValue(!value)} title={title}>
        {title}
      </Checkbox>
    </HStack>
  );
};
