import { Textarea } from 'nav-frontend-skjema';
import React, { useEffect, useState } from 'react';
import { IKvalitetsvurdering } from '../../../redux-api/kvalitetsvurdering';
import { CommentsField } from '../styled-components';

interface UtredningCommentsProps {
  show: boolean;
  kvalitetsvurdering: IKvalitetsvurdering;
  updateKvalitetsskjema: (kvalitetsvurdering: IKvalitetsvurdering) => void;
}

export const UtredningComments = ({ show, kvalitetsvurdering, updateKvalitetsskjema }: UtredningCommentsProps) => {
  const [utredningKommentar, setUtredningKommentar] = useState<string>(kvalitetsvurdering?.kommentarUtredning ?? '');

  useEffect(() => {
    if (kvalitetsvurdering?.kommentarUtredning === utredningKommentar || typeof kvalitetsvurdering === 'undefined') {
      return;
    }

    const timeout = setTimeout(() => {
      updateKvalitetsskjema({ ...kvalitetsvurdering, kommentarUtredning: utredningKommentar });
    }, 1000);
    return () => clearTimeout(timeout); // Clear existing timer every time it runs.
  }, [utredningKommentar, kvalitetsvurdering, updateKvalitetsskjema]);

  if (!show) {
    return null;
  }

  return (
    <CommentsField>
      <Textarea
        label="Utdypende kommentar til utredningen:"
        value={utredningKommentar}
        placeholder="NB: Ingen personopplysninger"
        maxLength={0}
        onChange={(e) => setUtredningKommentar(e.target.value)}
      />
    </CommentsField>
  );
};
