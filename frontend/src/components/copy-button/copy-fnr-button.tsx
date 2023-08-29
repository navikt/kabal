import React from 'react';
import { formatIdNumber } from '@app/functions/format-id';
import { CopyButton } from './copy-button';

interface Props {
  fnr: string;
}

export const CopyFnrButton = ({ fnr }: Props) => <CopyButton copyText={fnr} text={formatIdNumber(fnr)} />;
