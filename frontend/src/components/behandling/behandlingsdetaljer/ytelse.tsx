import React from 'react';
import { useFullYtelseNameFromId } from '@app/hooks/use-kodeverk-ids';
import { LabelTema } from '@app/styled-components/labels';
import { BehandlingSection } from './behandling-section';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const ytelse = useFullYtelseNameFromId(ytelseId);

  return (
    <BehandlingSection label="Ytelse">
      <LabelTema>{ytelse}</LabelTema>
    </BehandlingSection>
  );
};
