import { Textarea } from 'nav-frontend-skjema';
import React, { useEffect, useState } from 'react';
import { IKvalitetsvurdering } from '../../../redux-api/kvalitetsvurdering';
import { CommentsField } from '../styled-components';

interface VedtakCommentsProps {
  show: boolean;
  kvalitetsvurdering: IKvalitetsvurdering;
  updateKvalitetsskjema: (kvalitetsvurdering: IKvalitetsvurdering) => void;
}

export const VedtakComments = ({ show, kvalitetsvurdering, updateKvalitetsskjema }: VedtakCommentsProps) => {
  const [vedtakKommentar, setVedtakKommentar] = useState<string>(kvalitetsvurdering?.kommentarVedtak ?? '');

  useEffect(() => {
    if (kvalitetsvurdering?.kommentarVedtak === vedtakKommentar || typeof kvalitetsvurdering === 'undefined') {
      return;
    }

    const timeout = setTimeout(() => {
      updateKvalitetsskjema({ ...kvalitetsvurdering, kommentarVedtak: vedtakKommentar });
    }, 1000);
    return () => clearTimeout(timeout); // Clear existing timer every time it runs.
  }, [vedtakKommentar, kvalitetsvurdering, updateKvalitetsskjema]);

  if (!show) {
    return null;
  }

  return (
    <CommentsField>
      <Textarea
        label="Utdypende kommentar til vedtaket:"
        value={vedtakKommentar}
        placeholder="NB: Ingen personopplysninger"
        maxLength={0}
        onChange={(e) => setVedtakKommentar(e.target.value)}
      />
    </CommentsField>
  );
};
