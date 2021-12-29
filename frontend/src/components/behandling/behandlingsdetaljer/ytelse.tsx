import React from 'react';
import { useFullYtelseNameFromId } from '../../../hooks/use-kodeverk-ids';
import { useOppgaveType } from '../../../hooks/use-oppgave-type';
import { LabelTema } from '../../../styled-components/labels';
import { SubSection } from './sub-section';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const type = useOppgaveType();
  const ytelse = useFullYtelseNameFromId(type, ytelseId);

  return (
    <SubSection label="Ytelse">
      <LabelTema>{ytelse}</LabelTema>
    </SubSection>
  );
};
