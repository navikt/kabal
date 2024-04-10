import React, { useState } from 'react';
import { Abbreviation } from '@app/components/settings/abbreviations/abbreviation';
import { ABBREVIATIONS } from '@app/custom-data/abbreviations';
import { useAddAbbreviationMutation } from '@app/redux-api/bruker';

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
