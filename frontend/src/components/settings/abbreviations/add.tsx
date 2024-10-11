import { Abbreviation } from '@app/components/settings/abbreviations/abbreviation';
import { ABBREVIATIONS } from '@app/custom-data/abbreviations';
import { pushEvent } from '@app/observability';
import { useAddAbbreviationMutation } from '@app/redux-api/bruker';
import { useState } from 'react';

export const AddAbbreviation = () => {
  const [addAbbreviation, { isLoading }] = useAddAbbreviationMutation();
  const [localShort, setLocalShort] = useState('');
  const [localLong, setLocalLong] = useState('');

  const short = localShort.trim();
  const long = localLong.trim();

  const exists = ABBREVIATIONS.hasAbbreviation(short);
  const containsSpace = localShort.includes(' ');
  const hasEmptyField = short.length === 0 || long.length === 0;

  const onSave = async () => {
    await addAbbreviation({ short, long }).unwrap();
    setLocalShort('');
    setLocalLong('');
    pushEvent('add-abbreviation', 'abbreviations', { short, long });
  };

  return (
    <Abbreviation
      short={localShort}
      setShort={setLocalShort}
      long={localLong}
      setLong={setLocalLong}
      onSave={onSave}
      isDuplicate={exists}
      containsSpace={containsSpace}
      isSaving={isLoading}
      hasEmptyField={hasEmptyField}
      showLabels
    />
  );
};
