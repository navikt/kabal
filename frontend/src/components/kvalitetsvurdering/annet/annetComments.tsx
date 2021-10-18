import { Textarea } from 'nav-frontend-skjema';
import React, { useEffect, useState } from 'react';
import { IKvalitetsvurdering } from '../../../redux-api/kvalitetsvurdering';
import { CommentsField } from '../styled-components';

interface AnnetCommentsProps {
  show: boolean;
  kvalitetsvurdering: IKvalitetsvurdering;
  updateKvalitetsskjema: (kvalitetsvurdering: IKvalitetsvurdering) => void;
}

export const AnnetComments = ({ show, kvalitetsvurdering, updateKvalitetsskjema }: AnnetCommentsProps) => {
  // TODO: Use kvalitetsskjema annetKommentar
  const [annetKommentar, setAnnetKommentar] = useState<string>('');

  useEffect(() => {
    if (
      // TODO: kvalitetsvurdering?.kommentarAnnet === annetKommentar ||
      typeof kvalitetsvurdering === 'undefined'
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      // TODO: updateKvalitetsskjema({ ...kvalitetsvurdering, kommentarAnnet: annetKommentar });
    }, 1000);
    return () => clearTimeout(timeout); // Clear existing timer every time it runs.
  }, [annetKommentar, kvalitetsvurdering, updateKvalitetsskjema]);

  if (!show) {
    return null;
  }

  return (
    <CommentsField>
      <Textarea
        label="Kommentar:"
        value={annetKommentar}
        placeholder="NB: Ingen personopplysninger"
        maxLength={0}
        onChange={(e) => setAnnetKommentar(e.target.value)}
      />
    </CommentsField>
  );
};
