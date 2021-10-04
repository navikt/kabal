import { Textarea } from 'nav-frontend-skjema';
import React, { useEffect, useState } from 'react';
import { IKvalitetsvurdering } from '../../redux-api/kvalitetsvurdering';
import { CommentsField } from './styled-components';

interface AnnetCommentsProps {
  kvalitetsvurdering: IKvalitetsvurdering;
  updateKvalitetsskjema: (kvalitetsvurdering: IKvalitetsvurdering) => void;
}

export const AnnetComments = ({ kvalitetsvurdering, updateKvalitetsskjema }: AnnetCommentsProps) => {
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

  return (
    <CommentsField>
      <Textarea
        value={annetKommentar}
        label="Kommentar:"
        maxLength={0}
        onChange={(e) => setAnnetKommentar(e.target.value)}
      />
    </CommentsField>
  );
};
