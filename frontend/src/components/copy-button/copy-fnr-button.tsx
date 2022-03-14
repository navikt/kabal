import React from 'react';
import { formatSakenGjelder } from '../../functions/format-id';
import { CopyButton } from './copy-button';

interface Props {
  fnr?: string;
}

export const CopyFnrButton = ({ fnr }: Props) => <CopyButton text={fnr}>{formatSakenGjelder(fnr)}</CopyButton>;
