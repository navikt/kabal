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
  const [utredningKommentar, setUtredningKommentar] = useState<string>(
    kvalitetsvurdering?.kommentarOversendelsesbrev ?? ''
  );

  useEffect(() => {
    if (
      kvalitetsvurdering?.kommentarOversendelsesbrev === utredningKommentar ||
      typeof kvalitetsvurdering === 'undefined'
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      updateKvalitetsskjema({ ...kvalitetsvurdering, kommentarOversendelsesbrev: utredningKommentar });
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
        maxLength={0}
        onChange={(e) => setUtredningKommentar(e.target.value)}
      />
    </CommentsField>
  );
};
