import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { Checkbox, Tooltip } from '@navikt/ds-react';
import { useCallback, useContext, useMemo } from 'react';

interface Props {
  allSelectableDocuments: IJournalfoertDokumentId[];
}

export const SelectAll = ({ allSelectableDocuments }: Props) => {
  const { selectedCount, selectMany, unselectAll } = useContext(SelectContext);

  const allSelected = useMemo(
    () => selectedCount === allSelectableDocuments.length,
    [allSelectableDocuments.length, selectedCount],
  );

  const intermediate = useMemo(() => !allSelected && selectedCount > 0, [allSelected, selectedCount]);

  const onClick: React.MouseEventHandler<HTMLInputElement> = useCallback(
    () => (intermediate || allSelected ? unselectAll() : selectMany(allSelectableDocuments)),
    [allSelectableDocuments, allSelected, intermediate, selectMany, unselectAll],
  );

  return (
    <Tooltip content={TEXT} placement="top">
      <Checkbox
        hideLabel
        size="small"
        checked={allSelected}
        indeterminate={intermediate}
        onClick={onClick}
        style={{ gridArea: Fields.ToggleVedlegg }}
      >
        {TEXT}
      </Checkbox>
    </Tooltip>
  );
};

const TEXT = 'Velg alle dokumenter og vedlegg';
