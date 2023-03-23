import React from 'react';
import { useFullYtelseNameFromId } from '@app/hooks/use-kodeverk-ids';
import { LabelTema } from '@app/styled-components/labels';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => <LabelTema>{useFullYtelseNameFromId(ytelseId)}</LabelTema>;
