import { Abbreviation } from '@app/components/settings/abbreviations/abbreviation';
import { ABBREVIATIONS } from '@app/custom-data/abbreviations';
import { pushEvent } from '@app/observability';
import { useDeleteAbbreviationMutation, useUpdateAbbreviationMutation } from '@app/redux-api/bruker';
import type { CustomAbbrevation } from '@app/types/bruker';
import { useState } from 'react';

export const ExistingAbbreviation = ({ short: savedShort, long: savedLong, id }: CustomAbbrevation) => {
  const [deleteAbbreviation, { isLoading: isDeleting }] = useDeleteAbbreviationMutation();
  const [updateAbbreviation, { isLoading: isUpdating }] = useUpdateAbbreviationMutation();
  const [localShort, setLocalShort] = useState(savedShort);
  const [localLong, setLocalLong] = useState(savedLong);

  const short = localShort.trim();
  const long = localLong.trim();

  const isSaved = short === savedShort && long === savedLong;

  const isDuplicate = ABBREVIATIONS.isDuplicateAbbreviation(localShort, id);
  const hasEmptyField = short.length === 0 || long.length === 0;
  const containsSpace = localShort.includes(' ');

  return (
    <Abbreviation
      short={localShort}
      setShort={setLocalShort}
      long={localLong}
      setLong={setLocalLong}
      onSave={() => {
        updateAbbreviation({ short, long, id });
        pushEvent('update-abbreviation', 'abbreviations', { short, long });
      }}
      onDelete={() => {
        deleteAbbreviation(id);
        pushEvent('delete-abbreviation', 'abbreviations', { short, long });
      }}
      isSaved={isSaved}
      isSaving={isUpdating}
      isDeleting={isDeleting}
      isDuplicate={isDuplicate}
      containsSpace={containsSpace}
      hasEmptyField={hasEmptyField}
    />
  );
};
