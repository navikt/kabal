import { Checkbox, HStack } from '@navikt/ds-react';
import { Fields } from '@/components/documents/journalfoerte-documents/grid';
import { useDocumentsOnlyIncluded } from '@/hooks/settings/use-setting';

export const IncludedFilter = () => {
  const { value = false, setValue } = useDocumentsOnlyIncluded();

  const title = value ? 'Viser kun inkluderte dokumenter.' : 'Viser alle dokumenter.';

  return (
    <HStack align="center" justify="center" style={{ gridArea: Fields.Action }}>
      <Checkbox size="small" checked={value} hideLabel onChange={() => setValue(!value)} title={title}>
        {title}
      </Checkbox>
    </HStack>
  );
};
