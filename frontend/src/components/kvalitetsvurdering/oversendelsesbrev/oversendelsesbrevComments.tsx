import { Textarea } from 'nav-frontend-skjema';
import React, { useEffect, useState } from 'react';
import { IKvalitetsvurdering } from '../../../redux-api/kvalitetsvurdering';
import { CommentsField } from '../styled-components';

interface OversendelsesbrevCommentsProps {
  show: boolean;
  kvalitetsvurdering: IKvalitetsvurdering;
  updateKvalitetsskjema: (kvalitetsvurdering: IKvalitetsvurdering) => void;
}

export const OversendelsesbrevComments = ({
  show,
  kvalitetsvurdering,
  updateKvalitetsskjema,
}: OversendelsesbrevCommentsProps) => {
  const [oversendelsesbrevKommentar, setOversendelsesbrevKommentar] = useState<string>(
    kvalitetsvurdering?.kommentarOversendelsesbrev ?? ''
  );

  useEffect(() => {
    if (
      kvalitetsvurdering?.kommentarOversendelsesbrev === oversendelsesbrevKommentar ||
      typeof kvalitetsvurdering === 'undefined'
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      updateKvalitetsskjema({ ...kvalitetsvurdering, kommentarOversendelsesbrev: oversendelsesbrevKommentar });
    }, 1000);
    return () => clearTimeout(timeout); // Clear existing timer every time it runs.
  }, [oversendelsesbrevKommentar, kvalitetsvurdering, updateKvalitetsskjema]);

  if (!show) {
    return null;
  }

  return (
    <CommentsField>
      <Textarea
        label="Utdypende kommentar til oversendelsesbrev:"
        value={oversendelsesbrevKommentar}
        placeholder="NB: Ingen personopplysninger"
        maxLength={0}
        onChange={(e) => setOversendelsesbrevKommentar(e.target.value)}
      />
    </CommentsField>
  );
};
