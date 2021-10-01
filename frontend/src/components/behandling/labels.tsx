import React from 'react';
import { useTemaFromId, useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { LabelTema, LabelType } from '../../styled-components/labels';
import { StyledInfoDetails, StyledInfoLabel, StyledLabel, StyledLabels } from './styled-components';

interface LabelsProps {
  typeId: string;
  temaId: string;
}

export const Labels = ({ typeId, temaId }: LabelsProps) => {
  const temaName = useTemaFromId(temaId);
  const typeName = useTypeFromId(typeId);

  const TypeName = <LabelType>{typeName}</LabelType>;
  const TemaName = <LabelTema>{temaName}</LabelTema>;

  return (
    <StyledLabels>
      <StyledLabel>
        <StyledInfoLabel>Type:</StyledInfoLabel>
        <StyledInfoDetails>{TypeName}</StyledInfoDetails>
      </StyledLabel>

      <StyledLabel>
        <StyledInfoLabel>Tema:</StyledInfoLabel>
        <StyledInfoDetails>{TemaName}</StyledInfoDetails>
      </StyledLabel>
    </StyledLabels>
  );
};
