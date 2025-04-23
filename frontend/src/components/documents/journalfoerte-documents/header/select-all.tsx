import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { useAllSelected } from '@app/components/documents/journalfoerte-documents/keyboard/actions/select';
import {
  selectAll,
  unselectAll,
  useSelectionRangesState,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import { Checkbox } from '@navikt/ds-react';

export const SelectAll = () => {
  const allSelected = useAllSelected();
  const ranges = useSelectionRangesState();
  const hasSelected = ranges.length > 0;

  return (
    <div style={{ gridArea: Fields.Select }}>
      <Checkbox
        size="small"
        checked={allSelected}
        indeterminate={!allSelected && hasSelected}
        onClick={() => (hasSelected ? unselectAll() : selectAll())}
        hideLabel
      >
        Velg alle
      </Checkbox>
    </div>
  );
};
