import { Checkbox } from '@navikt/ds-react';
import React, { useCallback, useContext, useMemo } from 'react';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { IArkivertDocument } from '@app/types/arkiverte-documents';

interface Props {
  slicedFilteredDocuments: IArkivertDocument[];
}

export const SelectAll = ({ slicedFilteredDocuments }: Props) => {
  const { selectedDocuments, isSelected, selectMany, unselectAll } = useContext(SelectContext);

  const allSelected = useMemo(
    () => slicedFilteredDocuments.every((document) => isSelected(document)),
    [isSelected, slicedFilteredDocuments],
  );

  const onSelectAllChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target }) => {
      if (target.checked) {
        const mainDocuments = slicedFilteredDocuments.map(({ journalpostId, dokumentInfoId }) => ({
          journalpostId,
          dokumentInfoId,
        }));

        const attachments = slicedFilteredDocuments.flatMap(({ journalpostId, vedlegg }) =>
          vedlegg.map(({ dokumentInfoId }) => ({ dokumentInfoId, journalpostId })),
        );

        selectMany([...mainDocuments, ...attachments]);
      } else {
        unselectAll();
      }
    },
    [selectMany, slicedFilteredDocuments, unselectAll],
  );

  return (
    <Checkbox
      hideLabel
      size="small"
      checked={allSelected}
      indeterminate={!allSelected && Object.keys(selectedDocuments).length > 0}
      onChange={onSelectAllChange}
    >
      Velg alle dokumenter og vedlegg
    </Checkbox>
  );
};
