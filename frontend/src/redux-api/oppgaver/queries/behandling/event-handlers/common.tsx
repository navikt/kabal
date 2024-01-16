import React from 'react';
import { ToastName } from '@app/components/name/name';
import { formatIdNumber } from '@app/functions/format-id';

interface Props {
  id: string;
  name: string | null;
}

export const FormatName = ({ id, name = 'Navn mangler' }: Props) => (
  <b>
    {name} ({formatIdNumber(id)})
  </b>
);

export const getName = (navIdent: string | null, fallback: string = 'ingen / felles kø') => (
  <b>{navIdent === null ? fallback : <ToastName navIdent={navIdent} />}</b>
);
