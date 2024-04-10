import { CopyButtonProps } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { formatIdNumber } from '@app/functions/format-id';
import { CopyButton } from './copy-button';

interface Props extends Omit<CopyButtonProps, 'id' | 'copyText' | 'text' | 'activeText'> {
  id: string;
}

export const CopyIdButton = ({ id, ...props }: Props) => {
  const formatted = useMemo(() => formatIdNumber(id), [id]);

  return <CopyButton copyText={id} text={formatted} activeText={formatted} {...props} />;
};
