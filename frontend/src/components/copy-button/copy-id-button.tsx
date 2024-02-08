import { CopyButtonProps } from '@navikt/ds-react';
import React from 'react';
import { formatIdNumber } from '@app/functions/format-id';
import { CopyButton } from './copy-button';

interface Props extends Omit<CopyButtonProps, 'id' | 'copyText' | 'text'> {
  id: string;
}

export const CopyIdButton = ({ id, ...props }: Props) => (
  <CopyButton copyText={id} text={formatIdNumber(id)} {...props} />
);
