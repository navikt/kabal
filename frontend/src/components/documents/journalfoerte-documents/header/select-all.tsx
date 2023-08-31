import { Checkbox } from '@navikt/ds-react';
import React, { useCallback, useContext, useMemo } from 'react';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { IArkivertDocumentReference } from '@app/components/documents/journalfoerte-documents/select-context/types';

interface Props {
  allSelectableDocuments: IArkivertDocumentReference[];
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
    <Checkbox hideLabel size="small" checked={allSelected} indeterminate={intermediate} onClick={onClick}>
      Velg alle dokumenter og vedlegg
    </Checkbox>
  );
};
