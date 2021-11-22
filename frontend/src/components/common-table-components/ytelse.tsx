import React from 'react';
import { useFullYtelseNameFromId } from '../../hooks/use-kodeverk-ids';
import { LabelTema } from '../../styled-components/labels';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => <LabelTema>{useFullYtelseNameFromId(ytelseId)}</LabelTema>;
