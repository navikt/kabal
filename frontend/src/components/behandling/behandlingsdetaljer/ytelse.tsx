import React from 'react';
import { useFullYtelseNameFromId } from '../../../hooks/use-kodeverk-ids';
import { LabelTema } from '../../../styled-components/labels';
import { SubSection } from './sub-section';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const ytelse = useFullYtelseNameFromId(ytelseId);

  return (
    <SubSection label="Ytelse">
      <LabelTema>{ytelse}</LabelTema>
    </SubSection>
  );
};
