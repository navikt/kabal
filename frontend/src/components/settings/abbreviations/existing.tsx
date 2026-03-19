import { useState } from 'react';
import { Abbreviation } from '@/components/settings/abbreviations/abbreviation';
import { ABBREVIATIONS } from '@/custom-data/abbreviations';
import { pushEvent } from '@/observability';
import { useDeleteAbbreviationMutation, useUpdateAbbreviationMutation } from '@/redux-api/bruker';
import type { CustomAbbrevation } from '@/types/bruker';

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
